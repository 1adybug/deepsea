import equal from "fast-deep-equal"

/**
 * 比较两个对象的某些属性
 * @param keyList - 比较的 key 集合
 * @returns 是否相等
 */
export function compareProperties<T extends object>(a: T, b: T, ...keyList: (keyof T)[]): boolean {
    if (keyList.length === 0) throw new Error(`keyList 为空`)
    return keyList.every(key => equal(a[key], b[key]))
}
