import { createWriteStream } from "fs"
import { Readable } from "stream"

export type SaveFileOptions = {
    /** 要保存的文件 */
    file: File
    /** 保存文件的目标位置 */
    target: string
}

/**
 * 保存文件
 */
export async function saveFile({ file, target }: SaveFileOptions) {
    await new Promise((resolve, reject) => {
        const writeAble = createWriteStream(target)
        Readable.fromWeb(file.stream() as any)
            .pipe(writeAble)
            .on("finish", resolve)
            .on("error", reject)
    })
}
