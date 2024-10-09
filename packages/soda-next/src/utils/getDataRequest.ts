import { DataResponse } from "./getDataResponse"

export function getDataRequest<Loader extends (...args: any[]) => Promise<DataResponse<any> | undefined | void>>(
    loader: Loader,
): (...args: Parameters<Loader>) => Promise<Exclude<Awaited<ReturnType<Loader>>, undefined | void>["data"]> {
    return async (...args) => {
        const result = (await loader(...args)) ?? { success: true }
        const { success, data, message } = result
        if (!success) throw new Error(message)
        return data
    }
}
