import { existsSync } from "fs"
import { copyFile, mkdir, readdir, stat } from "fs/promises"
import { join, parse } from "path"

export type CopyOptions = {
    /** 源文件夹 */
    input: string | string[]
    /** 存放的文件夹 */
    output: string
    /** 文件权限 */
    mode?: number
}

export async function copy({ input, output, mode }: CopyOptions) {
    if (Array.isArray(input)) {
        for (const item of input) await copy({ input: item, output, mode })
        return
    }
    if (!existsSync(output)) await mkdir(output, { recursive: true })
    const status = await stat(input)
    const { base } = parse(input)
    if (status.isFile()) {
        await copyFile(input, join(output, base), mode)
        return
    }
    if (status.isDirectory()) {
        await mkdir(join(output, base), { recursive: true })
        const entries = await readdir(input, { withFileTypes: true })
        for (const entry of entries) {
            await copy({
                input: join(input, entry.name),
                output: join(output, base),
                mode
            })
        }
    }
}
