/**
 * 判断一个字符串是否满足关键字
 * @param item 要判断的字符串
 * @param keyword 关键字
 */
export function satisfyKeyword(item: string, keyword: string) {
    const ks = keyword.toLowerCase().split(" ").filter(Boolean)
    return ks.every(k => item.toLowerCase().includes(k))
}
