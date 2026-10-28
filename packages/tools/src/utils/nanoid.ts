function _nanoid() {
    return Math.random().toString(36).slice(2, 8).padEnd(6, "0")
}

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function nanoid(length = 6) {
    return Array(Math.ceil(length / 6))
        .fill(0)
        .map(_nanoid)
        .join("")
        .slice(0, length)
}
