/**
 * 判断一个变量是否是普通对象
 * @param value 要判断的变量
 * @returns 是普通对象返回 true，否则返回 false
 */
export function isPlainObject(value: any): value is Record<string, any> {
    return typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype
}
