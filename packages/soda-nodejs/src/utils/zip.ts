import { cpus } from "os"
import { execAsync } from "./execAsync"
import { check7zip } from "./check7zip"
import { install7zip } from "./install7zip"

export type ZipOptions = {
    /**
     * 要压缩的文件
     */
    source: string | string[]
    /**
     * 压缩到的目标位置
     */
    target: string
    /**
     * 线程数
     */
    thread?: number | "auto" | "max"
    /**
     * 压缩等级，0-9
     */
    level?: number
    /**
     * 是否加密
     */
    password?: string
}

export async function zip({ source, target, thread = "auto", level, password }: ZipOptions) {
    if (!(await check7zip())) {
        install7zip()
        return
    }
    source = Array.isArray(source) ? source.join(" ") : source
    const cpuCount = cpus().length
    if (thread === "max") thread = cpuCount
    return await execAsync(`7z a ${target} ${source} -mmt=${thread === "auto" ? "on" : thread}${typeof level === "number" ? ` -mx=${level}` : ""}${password ? ` -p${password}` : ""}`)
}
