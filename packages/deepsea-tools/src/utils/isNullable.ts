import { isNonNullable } from "./isNonNullable"

/** 
 * 判断一个值是否是空值
 */
export function isNullable<T>(value: T): value is Exclude<T, NonNullable<T>> {
    return !isNonNullable(value)
}
