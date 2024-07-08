/**
 * 取两个整数之间的随机数
 * @param start - 开始的数字，闭区间
 * @param end - 结束的数字，闭区间
 * @returns 两个整数之间的随机数
 */
export function getRandomBetween(start: number, end: number) {
    if (!Number.isInteger(start)) throw new Error("开始的数字必须是整数")
    if (!Number.isInteger(end)) throw new Error("结束的数字必须是整数")
    if (end < start) throw new Error("结束的数字必须大于或者等于开始的数字")
    return start + Math.floor(Math.random() * (end + 1 - start))
}
