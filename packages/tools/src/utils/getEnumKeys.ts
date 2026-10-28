import { getEnumEntries } from "./getEnumEntries"

/**
 * 获取枚举对象的键数组
 * @param obj 枚举对象
 * @returns 键数组
 */
export function getEnumKeys<T extends Record<string | number, string | number>>(obj: T): (keyof T)[] {
    return getEnumEntries(obj).map(([key]) => key)
}
