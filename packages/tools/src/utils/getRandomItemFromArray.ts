import { getRandomBetween } from "./getRandomBetween"

/**
 * 取数组中的随机一个元素
 * @param array - 数组
 * @returns 数组中的随机一个元素
 */
export function getRandomItemFromArray<T>(array: T[]): T {
    return array[getRandomBetween(0, array.length - 1)]
}
