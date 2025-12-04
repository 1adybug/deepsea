import { existsSync, mkdirSync } from "fs"
import { basename, dirname, resolve } from "path"

import { create } from "tar"

export interface CompressionParams {
    /**
     * 需要压缩的文件夹
     */
    input: string
    /**
     * 压缩后的文件路径
     */
    output: string
}

export async function compress({ input, output }: CompressionParams) {
    input = resolve(input)

    // 确保源路径存在
    if (!existsSync(input)) throw new Error("Source folder does not exist")

    // 确保输出目录存在
    const outputDir = dirname(output)

    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true })

    // 执行压缩
    await create(
        {
            gzip: true, // 使用 gzip 压缩
            file: output, // 输出文件路径
            cwd: dirname(input), // 设置工作目录
        },
        [basename(input)], // 要压缩的文件夹名
    )

    return resolve(output)
}
