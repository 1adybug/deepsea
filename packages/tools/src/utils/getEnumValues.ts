import { getEnumEntries } from "./getEnumEntries"

/**
 * 获取枚举对象的值数组
 * @param obj 枚举对象
 * @returns 值数组
 */
export function getEnumValues<T extends Record<string | number, string | number>>(obj: T): T[keyof T][] {
    return getEnumEntries(obj).map(([key, value]) => value)
}
