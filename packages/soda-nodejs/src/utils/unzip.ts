import { check7zip } from "./check7zip"
import { execAsync } from "./execAsync"
import { install7zip } from "./install7zip"

export type UnzipOptions = {
    /**
     * 要解压的文件
     */
    source: string
    /**
     * 解压到的目标位置
     */
    target: string
}

/**
 * 解压文件
 */
export async function unzip({ source, target }: UnzipOptions) {
    if (!(await check7zip())) {
        install7zip()
        throw new Error("检测不到 7z 命令")
    }
    return await execAsync(`7z x ${source} -o${target}`)
}
