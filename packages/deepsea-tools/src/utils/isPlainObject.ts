/** 判断一个变量是否是普通对象 */
export function isPlainObject(value: any): value is Record<string, any> {
    return typeof value === "object" && value !== null && Object.getPrototypeOf(value) === Object.prototype
}
