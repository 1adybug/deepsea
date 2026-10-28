/**
 * 如果数组为空，则返回一个包含指定值的数组。
 * 如果数组不为空，则返回原数组。
 *
 * @param array 需要检查的数组。
 * @param value 需要填充的值。
 * @returns 如果数组为空，则返回一个包含指定值的数组，否则返回原数组。
 */
export function emptyWith<T>(array: T[], value: T | (() => T)) {
    if (array.length > 0) return array
    if (typeof value === "function") return [(value as () => T)()]
    return [value]
}
