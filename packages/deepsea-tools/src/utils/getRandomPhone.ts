import { digits } from "@/constants/index"
import { getRandomItemFromArray } from "./getRandomItemFromArray"

/**
 * 获取随机手机号
 * @returns 随机手机号
 */
export function getRandomPhone() {
    const secondList = [3, 5, 7, 8, 9]

    const thirdList: Record<string, number[]> = {
        3: digits,
        5: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        7: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        8: digits,
        9: [1, 5, 8, 9],
    }

    const second = getRandomItemFromArray(secondList)

    const third = getRandomItemFromArray(thirdList[second])

    return `1${second}${third}${Array(8)
        .fill(0)
        .map(() => getRandomItemFromArray(digits))
        .join("")}`
}
