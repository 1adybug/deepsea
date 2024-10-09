import { createWriteStream } from "fs"
import { Readable } from "stream"

/**
 * 从 Response 对象中下载文件
 * @param response Response 对象
 * @param file 文件路径
 */
export async function saveResponse(response: Response, file: string) {
    const writeable = createWriteStream(file)
    await new Promise((resolve, reject) =>
        Readable.fromWeb(response.body! as any)
            .pipe(writeable)
            .on("close", resolve)
            .on("error", reject),
    )
}
