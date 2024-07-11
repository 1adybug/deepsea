/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function nanoid(length = 6) {
    return Math.random()
        .toString(36)
        .slice(2, 2 + length)
        .padEnd(length, "0")
}
