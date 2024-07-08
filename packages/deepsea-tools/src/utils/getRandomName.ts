import { getRandomItemFromArray } from "./getRandomItemFromArray"
import { possibility } from "./possibility"

/**
 * 获取随机姓名
 * @returns 随机姓名
 */
export function getRandomName() {
    const firstList = ["张", "李", "王", "赵", "钱", "孙", "李", "吴", "徐", "周", "庞", "关", "朱"]

    const secondList = ["子", "文", "涛", "权", "明", "亮", "盛", "雨", "宇", "冰", "浩", "腾", "勇", "雪"]

    return `${getRandomItemFromArray(firstList)}${getRandomItemFromArray(secondList)}${possibility(0.66) ? getRandomItemFromArray(secondList) : ""}`
}
