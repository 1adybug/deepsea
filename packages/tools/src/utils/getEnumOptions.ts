import { getEnumEntries } from "./getEnumEntries"

export type EnumOption<T extends Record<string | number, string | number>> = {
    label: Exclude<keyof T, symbol>
    value: T[keyof T]
}

/**
 * 获取枚举对象的选项数组
 * @param obj 枚举对象
 * @returns 选项数组
 */
export function getEnumOptions<T extends Record<string | number, string | number>>(obj: T): EnumOption<T>[] {
    return getEnumEntries(obj).map(([label, value]) => ({ label, value })) as EnumOption<T>[]
}
