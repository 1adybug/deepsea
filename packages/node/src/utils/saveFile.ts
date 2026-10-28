import { createWriteStream } from "node:fs"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"

export type SaveFileOptions = {
    /** 要保存的文件 */
    input: File
    /** 保存文件的目标位置 */
    output: string
}

/**
 * 保存文件
 */
export async function saveFile({ input, output }: SaveFileOptions) {
    await pipeline(Readable.fromWeb(input.stream() as any), createWriteStream(output))
}
