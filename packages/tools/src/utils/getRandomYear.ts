import { getRandomBetween } from "./getRandomBetween"

/**
 * 获取随机年份
 * @returns 随机年份
 */
export function getRandomYear() {
    return new Date().getFullYear() - getRandomBetween(20, 50)
}
