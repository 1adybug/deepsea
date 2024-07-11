import { createWriteStream } from "fs"
import { Readable } from "stream"

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
    await new Promise((resolve, reject) => {
        const writeAble = createWriteStream(output)
        Readable.fromWeb(input.stream() as any)
            .pipe(writeAble)
            .on("finish", resolve)
            .on("error", reject)
    })
}
