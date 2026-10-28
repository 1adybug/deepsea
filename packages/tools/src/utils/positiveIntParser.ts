import { intParser } from "./intParser"

/**
 * 将字符串转换为正整数
 * @param value 字符串
 * @returns 正整数
 */
export function positiveIntParser(value: string | null | undefined) {
    const num = intParser(value)
    return num && num > 0 ? num : undefined
}
