export interface DataResponse<Data = unknown> {
    /** 是否成功 */
    success: boolean
    /** 数据 */
    data?: Data
    /** 消息 */
    message?: string | Error
}

export type GetLoaderDataType<Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void>> =
    Awaited<ReturnType<Loader>> extends DataResponse<infer T> ? T : undefined

export interface RequestEventListener<
    Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void> = (arg: unknown) => Promise<DataResponse<unknown>>,
> {
    request: (arg: Parameters<Loader>[0], loader: Loader) => void
    success: (data: GetLoaderDataType<Loader>, arg: Parameters<Loader>[0], loader: Loader) => void
    error: (error: Error, arg: Parameters<Loader>[0], loader: Loader) => void
    settled: (error: Error | undefined, data: GetLoaderDataType<Loader> | undefined, arg: Parameters<Loader>[0], loader: Loader) => void
}

export type RequestEventListeners<
    Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void> = (arg: unknown) => Promise<DataResponse<unknown>>,
> = {
    [Event in keyof RequestEventListener<Loader>]: Set<RequestEventListener<Loader>[Event]>
}

interface RequestFnWithoutPreset<Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void>> {
    (...args: Parameters<Loader>): Promise<GetLoaderDataType<Loader>>
    onRequest(listener: RequestEventListener<Loader>["request"] | undefined): this
    onSuccess(listener: RequestEventListener<Loader>["success"] | undefined): this
    onError(listener: RequestEventListener<Loader>["error"] | undefined): this
    onSettled(listener: RequestEventListener<Loader>["settled"] | undefined): this
}

export interface RequestFn<Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void>> extends RequestFnWithoutPreset<Loader> {
    preset(...args: Parameters<Loader>): RequestFnWithoutPreset<() => ReturnType<Loader>>
}

const map: RequestEventListeners = {
    request: new Set(),
    success: new Set(),
    error: new Set(),
    settled: new Set(),
}

function getEventListeners<Event extends keyof RequestEventListener>(event: Event): Set<RequestEventListener[Event]> {
    return map[event]
}

function removeEventListener<Event extends keyof RequestEventListener>(event: Event, listener: RequestEventListener[Event]) {
    return map[event].delete(listener)
}

function addEventListener<Event extends keyof RequestEventListener>(event: Event, listener: RequestEventListener[Event]) {
    map[event].add(listener)
    return function removeEventListener() {
        map[event].delete(listener)
    }
}

function tryOrLog(fn: () => void) {
    try {
        fn()
    } catch (error) {
        console.error(error)
    }
}

export function createRequestFn<Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void>>(loader: Loader): RequestFn<Loader> {
    function _createRequestFn<Loader extends (arg: any) => Promise<DataResponse<any> | undefined | void>, PresetArgs = undefined>(
        loader: Loader,
        presetArgs?: PresetArgs,
        originalLoader?: any,
    ): PresetArgs extends undefined ? RequestFn<Loader> : Omit<RequestFn<() => ReturnType<Loader>>, "preset"> {
        let onRequestListener: RequestEventListener<Loader>["request"] | undefined
        let onSuccessListener: RequestEventListener<Loader>["success"] | undefined
        let onErrorListener: RequestEventListener<Loader>["error"] | undefined
        let onSettledListener: RequestEventListener<Loader>["settled"] | undefined

        // 获取请求函数，如果有预设参数，则使用预设参数，否则使用请求参数
        const loaderForEvent = originalLoader ?? loader

        async function request(...args: Parameters<Loader>): Promise<GetLoaderDataType<Loader>> {
            // 获取参数，如果有预设参数，则使用预设参数，否则使用请求参数
            const argForEvent = (presetArgs ?? (args as any))[0]

            try {
                // 触发请求事件
                tryOrLog(() => onRequestListener?.(argForEvent, loaderForEvent))
                getEventListeners("request").forEach(listener => tryOrLog(() => listener(argForEvent, loaderForEvent)))

                // 请求数据
                const result = (await (loader as any)(...args)) ?? { success: true }
                let { success, data, message } = result

                // 处理错误
                if (!success) throw message instanceof Error ? message : new Error(message)

                // 触发成功事件
                tryOrLog(() => onSuccessListener?.(data, argForEvent, loaderForEvent))
                getEventListeners("success").forEach(listener => tryOrLog(() => listener(data, argForEvent, loaderForEvent)))

                // 触发结束事件
                tryOrLog(() => onSettledListener?.(undefined, data, argForEvent, loaderForEvent))
                getEventListeners("settled").forEach(listener => tryOrLog(() => listener(undefined, data, argForEvent, loaderForEvent)))
                return data
            } catch (e) {
                const error = e as Error

                // 触发错误事件
                tryOrLog(() => onErrorListener?.(error, argForEvent, loaderForEvent))
                getEventListeners("error").forEach(listener => tryOrLog(() => listener(error, argForEvent, loaderForEvent)))

                // 触发结束事件
                tryOrLog(() => onSettledListener?.(error, undefined, argForEvent, loaderForEvent))
                getEventListeners("settled").forEach(listener => tryOrLog(() => listener(error, undefined, argForEvent, loaderForEvent)))
                throw error
            }
        }

        if (loader.name) Object.defineProperty(request, "name", { value: loader.name })

        request.onRequest = function onRequest(listener?: RequestEventListener<Loader>["request"]) {
            onRequestListener = listener
            return request
        }

        request.onSuccess = function onSuccess(listener?: RequestEventListener<Loader>["success"]) {
            onSuccessListener = listener
            return request
        }

        request.onError = function onError(listener: RequestEventListener<Loader>["error"]) {
            onErrorListener = listener
            return request
        }

        request.onSettled = function onSettled(listener: RequestEventListener<Loader>["settled"]) {
            onSettledListener = listener
            return request
        }

        if (!presetArgs) {
            request.preset = function preset(...args: Parameters<Loader>) {
                async function request(): Promise<GetLoaderDataType<Loader>> {
                    return (await (loader as any)(...args)) as any
                }

                if (loader.name) Object.defineProperty(request, "name", { value: loader.name })

                return _createRequestFn(request as any, args, loaderForEvent)
            }
        }

        return request as any
    }

    return _createRequestFn(loader)
}

createRequestFn.addEventListener = addEventListener
createRequestFn.removeEventListener = removeEventListener
createRequestFn.getEventListeners = getEventListeners
