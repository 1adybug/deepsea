import { intParser } from "./intParser"

/**
 * 将字符串转换为自然数（非负整数）
 * @param value 字符串
 * @returns 自然数
 */
export function naturalParser(value: string | null | undefined) {
    const num = intParser(value)
    return typeof num === "number" && num >= 0 ? num : undefined
}
