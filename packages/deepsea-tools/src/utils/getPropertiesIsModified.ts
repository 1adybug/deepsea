import equal from "fast-deep-equal"

/**
 * 得到一个函数，用于判断两个对象之间某些属性是否改变
 * @param a - 对象a
 * @param b - 对象b
 * @returns 一个函数，用于判断两个对象之间某些属性是否改变
 */
export function getPropertiesIsModified<T>(a: T, b: T): (...keyList: (keyof T)[]) => boolean {
    return function (...keyList: (keyof T)[]) {
        return keyList.some(key => !equal(a[key], b[key]))
    }
}
