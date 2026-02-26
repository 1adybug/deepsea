import { $ZodType, parse } from "zod/v4/core"

import { assignFnName } from "./assignFnName"
import { createFnWithMiddleware, Middleware } from "./createFnWithMiddleware"

export interface ResponseData<TData = unknown> {
    /** 是否成功 */
    success: boolean
    /** 数据 */
    data?: TData
    /** 消息 */
    message?: string | Error
}

export type WithPromise<TData> = TData | Promise<TData>

export interface OriginalRequestFn<TParams extends [arg?: unknown] = [arg: unknown], TData = never> {
    (...args: TParams): WithPromise<ResponseData<TData> | undefined | void>
    schema?: TParams extends [] ? undefined : $ZodType<TParams[0]>
}

export type RequestFnReturnType<TParams extends [arg?: unknown] = [arg: unknown], TData = never> =
    Awaited<ReturnType<OriginalRequestFn<TParams, TData>>> extends ResponseData<infer T> ? T : undefined

export interface RequestFn<TParams extends [arg?: unknown] = [arg: unknown], TData = never> {
    (...args: TParams): Promise<RequestFnReturnType<TParams, TData>>
    use(middleware: Middleware<(...args: TParams) => Promise<RequestFnReturnType<TParams, TData>>>): this
    preset(...args: TParams): () => Promise<RequestFnReturnType<TParams, TData>>
}

const requestFnSymbol = Symbol("requestFn")

export function isRequestFn(fn: unknown): fn is RequestFn {
    return typeof fn === "function" && (fn as any)[requestFnSymbol] === true
}

const globalRequestFnMiddlewares: Middleware[] = []

export interface CreateResponseFnParams<TParams extends [arg?: unknown] = [arg: unknown], TData = never> {
    fn: OriginalRequestFn<TParams, TData>
    schema?: TParams extends [] ? undefined : $ZodType<TParams[0]>
    name?: string
}

export function createRequestFn<TParams extends [arg?: unknown] = [arg: unknown], TData = never>(
    fn: OriginalRequestFn<TParams, TData>,
): RequestFn<TParams, TData>
export function createRequestFn<TParams extends [arg?: unknown] = [arg: unknown], TData = never>(
    params: CreateResponseFnParams<TParams, TData>,
): RequestFn<TParams, TData>
export function createRequestFn<TParams extends [arg?: unknown] = [arg: unknown], TData = never>(
    fnOrParams: OriginalRequestFn<TParams, TData> | CreateResponseFnParams<TParams, TData>,
): RequestFn<TParams, TData> {
    let { fn, schema, name } = (typeof fnOrParams === "function" ? { fn: fnOrParams } : fnOrParams) as CreateResponseFnParams<TParams, TData>
    if (!schema) schema = fn.schema

    async function request(...args: TParams): Promise<RequestFnReturnType<TParams, TData>> {
        if (schema) args = [parse(schema, args.at(0))] as any as TParams
        const result = await fn(...args)
        if (result === undefined) return undefined as RequestFnReturnType<TParams, TData>
        if (!result.success) throw result.message instanceof Error ? result.message : new Error(result.message)
        return result.data as RequestFnReturnType<TParams, TData>
    }

    assignFnName(request, name ?? fn)

    const newRequest = createFnWithMiddleware(request, { global: globalRequestFnMiddlewares }) as RequestFn<TParams, TData>

    Object.defineProperty(newRequest, requestFnSymbol, { value: true })
    newRequest.preset = function preset(...args: TParams): () => Promise<RequestFnReturnType<TParams, TData>> {
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
