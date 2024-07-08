/** 判断两个数字是否相等 */
export function twoNumberIsEqual(a: number, b: number) {
    if (a === b) return true
    if (Number.isNaN(a) && Number.isNaN(b)) return true
    if (Number.isNaN(a) || Number.isNaN(b)) return false
    return Math.abs(a - b) < Number.EPSILON
}