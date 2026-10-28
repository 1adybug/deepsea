/**
 * 判断一个字符是否是全角字符
 * @param char - 字符，必须是单个字符，否则会报错
 * @returns 是否是全角字符
 */
export function isFullWidthChar(char: string) {
    if (char.length !== 1) throw new Error("Function expects a single character")

    const code = char.charCodeAt(0)

    // CJK 符号和标点
    if (code >= 0x3000 && code <= 0x303f) return true

    // 全角ASCII、全角标点
    if (code >= 0xff00 && code <= 0xffef) return true

    // CJK 统一表意符号
    if (code >= 0x4e00 && code <= 0x9faf) return true

    // 韩文
    if (code >= 0x1100 && code <= 0x11ff) return true

    // 韩文兼容字母
    if (code >= 0x3130 && code <= 0x318f) return true

    // 韩文音节
    if (code >= 0xac00 && code <= 0xd7af) return true

    return false
}
