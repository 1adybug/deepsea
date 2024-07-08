/**
 * 获取枚举对象的键值对数组
 * @param obj 枚举对象
 * @returns 键值对数组
 */
export function getEnumEntries<T extends Record<string | number, string | number>>(obj: T): [keyof T, T[keyof T]][] {
    const entries = Object.entries(obj)
    const hasNum = entries.findLastIndex(([key, value]) => typeof value === "number") !== -1
    return (hasNum ? entries.filter(([key, value]) => typeof value === "number") : entries) as [keyof T, T[keyof T]][]
}
