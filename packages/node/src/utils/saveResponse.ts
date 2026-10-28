import { createWriteStream } from "node:fs"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

/**
 * 从 Response 对象中下载文件
 * @param response Response 对象
 * @param file 文件路径
 */
export async function saveResponse(response: Response, file: string) {
    if (response.body === null) throw new Error("Response has no body")
    await pipeline(Readable.fromWeb(response.body as any), createWriteStream(file))
}
