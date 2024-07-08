import equal from "fast-deep-equal"

/**
 * 比较两个变量是否相等
 * @param ignoreList - 忽略的 key 集合
 * @returns 是否相等
 */
export function compareWithoutProperties<T extends Object>(a: T, b: T, ...ignoreList: (keyof T)[]): boolean {
    if (ignoreList.length === 0) throw new Error(`ignoreList 为空`)
    const keys = Array.from(new Set(Object.keys(a).concat(Object.keys(b))))
    return keys.filter(key => !ignoreList.includes(key as keyof T)).every(key => equal(a[key as keyof T], b[key as keyof T]))
}
