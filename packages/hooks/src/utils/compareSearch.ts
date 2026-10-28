import { compareArray } from "./compareArray"

/**
 * 比较两个搜索对象是否相等
 * @param a 搜索对象a
 * @param b 搜索对象b
 * @returns 是否相等
 */
export function compareSearch(a: Record<string, string[]>, b: Record<string, string[]>) {
    return compareArray(Object.keys(a), Object.keys(b)) && Object.keys(a).every(key => compareArray(a[key], b[key]))
}
