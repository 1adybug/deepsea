import which from "which"

import { execAsync } from "./execAsync"

export type UnzipOptions = {
    /**
     * 要解压的文件
     */
    input: string
    /**
     * 解压到的目标文件夹位置
     */
    output: string
    /**
     * 压缩文件时的工作目录
     */
    cwd?: string
}

/**
 * 使用 7z 命令解压文件
 * - 如果没有安装 7z，请先安装 7z 后再执行
 * - 下载地址：https://www.7-zip.org/download.html
 * - 如果已经安装，请按照以下步骤将 7z 添加到环境变量中
 * 1. 设置 → 系统 → 右侧系统信息 → 高级系统设置 → 环境变量
 * 2. 在系统变量中找到并选中 Path，点击编辑
 * 3. 点击新建，输入 7z 的安装路径（默认是 C:\Program Files\7-Zip），点击确定
 * 4. 重启终端，输入 7z，如果出现 7z 的版本信息，则安装成功
 * 5. 如果没有出现版本信息，请重启电脑，或者检查 7z 的安装路径是否正确
 */
export async function unzip({ input, output, cwd }: UnzipOptions) {
    await which("7z")
    return await execAsync(`7z x ${input} -o${output}`, { cwd })
}
