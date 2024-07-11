import which from "which"

/**
 * 检测 7z 命令是否存在
 */
export async function check7zip() {
    try {
        await which("7z")
        return true
    } catch (error) {
        return false
    }
}
