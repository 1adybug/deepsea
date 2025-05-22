import { assignFnName } from "./assignFnName"
import { Middleware, createFnWithMiddleware } from "./createFnWithMiddleware"

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

export function createRequestFn<Fn extends OriginalRequestFn>(fn: Fn): RequestFn<Fn> {
    async function request(...args: Parameters<Fn>): Promise<RequestFnReturnType<Fn>> {
        const result = await fn(...args)
        if (result === undefined) return undefined as RequestFnReturnType<Fn>
        if (!result.success) throw result.message instanceof Error ? result.message : new Error(result.message)
        return result.data
    }
    assignFnName(request, fn)
    const newRequest = createFnWithMiddleware(request, { global: globalRequestFnMiddlewares }) as RequestFn<Fn>
    Object.defineProperty(newRequest, requestFnSymbol, { value: true })
    newRequest.preset = function preset(...args: Parameters<Fn>): () => Promise<RequestFnReturnType<Fn>> {
        async function requestWithPreset() {
            return await newRequest(...args)
        }
        assignFnName(requestWithPreset, fn)
        return requestWithPreset
    }
    return newRequest
}

createRequestFn.use = function use(middleware: Middleware) {
    globalRequestFnMiddlewares.push(middleware)
    return createRequestFn
}
