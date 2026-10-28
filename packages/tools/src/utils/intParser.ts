import { intReg } from "@/constants/index"

/**
 * 将字符串转换为整数
 * @param value 字符串
 * @returns 整数
 */
export function intParser(value: string | null | undefined) {
    if (!value) return undefined
    value = value.trim()
    if (!intReg.test(value)) return undefined
    return parseInt(value)
}
