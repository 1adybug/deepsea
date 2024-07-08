import { getRandomBetween } from "./getRandomBetween"
import { getRandomDate } from "./getRandomDate"
import { getRandomYear } from "./getRandomYear"

/**
 * 获取一个随机身份证
 * @param area - 区号
 * @returns 一个随机身份证
 */
export function getRandomId(area?: number) {
    if (typeof area === "number") {
        if (!Number.isInteger(area)) throw new Error("区号必须是整数")
        if (area < 110000 || area > 820000) throw new Error("区号必须在 110000 和 820000 之间")
    }

    return `${area ?? "380812"}${getRandomYear()}${getRandomDate()}${getRandomBetween(0, 9)}${getRandomBetween(0, 9)}${getRandomBetween(0, 9)}${getRandomBetween(0, 9)}`
}
