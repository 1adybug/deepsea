import { isNonNullable } from "./isNonNullable"

/**
 * 判断数组是否不为空
 * @param array 数组
 * @returns 是否不为空
 */
export function isNotEmpty<T>(array?: T[] | undefined | null): array is T[] {
    return isNonNullable(array) && array.length > 0
}
