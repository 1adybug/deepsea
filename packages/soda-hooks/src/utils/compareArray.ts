/**
 * 比较两个数组是否相等
 * @param a 数组a
 * @param b 数组b
 * @returns 是否相等
 */
export function compareArray(a: any[] | readonly any[], b: any[] | readonly any[]) {
    return Object.is(a, b) || (a.length === b.length && a.every((value, index) => Object.is(value, b[index])))
}
