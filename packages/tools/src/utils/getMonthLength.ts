/**
 * 获取一个月的长度，忽略闰年
 * @param month 月份
 * @returns 一个月的长度
 */
export function getMonthLength(month: number) {
    const a: number[] = [1, 3, 5, 7, 8, 10, 12]

    const b: number[] = [4, 6, 9, 11]

    if (a.includes(month)) return 31
    if (b.includes(month)) return 30
    return 28
}
