/**
 * 获取枚举的 key
 * @param obj 枚举对象
 * @param value 枚举值
 * @returns 枚举的 key
 */
export function getEnumKey<T extends Record<string | number, string | number>>(obj: T, value: T[keyof T]): keyof T {
    return Object.keys(obj).find(key => obj[key] === value) as keyof T
}
