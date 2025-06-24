import { isNonNullable } from "./isNonNullable"

/**
 * 判断一个值是否是可迭代对象
 */
export function isIterable<T = any>(value: unknown): value is Iterable<T> {
    return isNonNullable(value) && typeof (value as any)[Symbol.iterator] === "function"
}
