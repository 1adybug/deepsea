import { getMonthLength } from "./getMonthLength"
import { getRandomBetween } from "./getRandomBetween"

/**
 * 获取一个随机月份日期
 * @returns 一个随机月份日期
 */
export function getRandomDate() {
    const month = getRandomBetween(1, 12)
    const monthStr = `${month < 10 ? 0 : ""}${month}`
    const date = getRandomBetween(1, getMonthLength(month))
    const dateStr = `${date < 10 ? 0 : ""}${date}`
    return `${monthStr}${dateStr}`
}
