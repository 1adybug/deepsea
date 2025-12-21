import { $ZodType, parse } from "zod/v4/core"

import { assignFnName } from "./assignFnName"
import { createFnWithMiddleware, Middleware } from "./createFnWithMiddleware"

export interface ResponseData<Data = unknown> {
    /** 是否成功 */
    success: boolean
    /** 数据 */
    data?: Data
    /** 消息 */
    message?: string | Error
}

export type WithPromise<T> = T | Promise<T>

export type OriginalRequestFn = (...args: any[]) => WithPromise<ResponseData<any> | undefined | void>

export type RequestFnReturnType<Fn extends OriginalRequestFn> = Awaited<ReturnType<Fn>> extends ResponseData<infer T> ? T : undefined

export interface RequestFn<Fn extends OriginalRequestFn> {
    (...args: Parameters<Fn>): Promise<RequestFnReturnType<Fn>>
    use(middleware: Middleware<(...args: Parameters<Fn>) => Promise<RequestFnReturnType<Fn>>>): this
    preset(...args: Parameters<Fn>): () => Promise<RequestFnReturnType<Fn>>
}

const requestFnSymbol = Symbol("requestFn")

export function isRequestFn(fn: unknown): fn is RequestFn<OriginalRequestFn> {
    return typeof fn === "function" && (fn as any)[requestFnSymbol] === true
}

const globalRequestFnMiddlewares: Middleware[] = []

export interface CreateResponseFnParams<Fn extends OriginalRequestFn> {
    fn: Fn
    schema?: Parameters<Fn> extends [] ? undefined : $ZodType<Parameters<Fn>[0]>
    name?: string
}

export function createRequestFn<Fn extends OriginalRequestFn>(fn: Fn): RequestFn<Fn>
export function createRequestFn<Fn extends OriginalRequestFn>(params: CreateResponseFnParams<Fn>): RequestFn<Fn>
export function createRequestFn<Fn2 extends OriginalRequestFn>(fnOrParams: Fn2 | CreateResponseFnParams<Fn2>): RequestFn<Fn2> {
    const { fn, schema, name } = (typeof fnOrParams === "function" ? { fn: fnOrParams } : fnOrParams) as CreateResponseFnParams<Fn2>

    async function request(...args: Parameters<Fn2>): Promise<RequestFnReturnType<Fn2>> {
        if (schema) args = [parse(schema, args.at(0))] as Parameters<Fn2>
        const result = await fn(...args)
        if (result === undefined) return undefined as RequestFnReturnType<Fn2>
        if (!result.success) throw result.message instanceof Error ? result.message : new Error(result.message)
        return result.data
    }

    assignFnName(request, name ?? fn)

    const newRequest = createFnWithMiddleware(request, { global: globalRequestFnMiddlewares }) as RequestFn<Fn2>

    Object.defineProperty(newRequest, requestFnSymbol, { value: true })
    newRequest.preset = function preset(...args: Parameters<Fn2>): () => Promise<RequestFnReturnType<Fn2>> {
        async function requestWithPreset() {
            return await newRequest(...args)
        }

        assignFnName(requestWithPreset, name ?? fn)
        return requestWithPreset
    }

    return newRequest
}

createRequestFn.use = function use(middleware: Middleware) {
    globalRequestFnMiddlewares.push(middleware)
    return createRequestFn
}
