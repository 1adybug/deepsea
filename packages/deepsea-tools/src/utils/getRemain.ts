/**
 * 取余函数
 * @param a 被除数
 * @param b 除数
 * @returns 余数
 */
export function getRemain(a: number, b: number) {
    const r = a % b
    return a >= 0 ? r : r + Math.abs(b)
}
