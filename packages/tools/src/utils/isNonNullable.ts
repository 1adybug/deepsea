/**
 * 判断一个值是否是非空值
 */
export function isNonNullable<T>(value: T): value is NonNullable<T> {
    return value !== null && value !== undefined
}
