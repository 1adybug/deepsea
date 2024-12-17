import { plateNoAlphabets } from "@/constants/index"
import { getArray } from "./getArray"
import { getRandomItemFromArray } from "./getRandomItemFromArray"

/**
 * 获取一个随机车牌号
 * @param start - 开始的两位，默认是苏H
 * @returns 一个随机车牌号
 */
export function getRandomPlateNo(start?: string) {
    return `${start ?? "苏H"}${getArray(5, () => getRandomItemFromArray(plateNoAlphabets)).join("")}`
}
