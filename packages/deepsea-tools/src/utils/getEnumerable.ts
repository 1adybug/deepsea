/**
 * 获取对象的可枚举属性
 * @param obj 对象
 * @returns 可枚举属性
 */
export function getEnumerable<T extends {}>(obj: T): (keyof T)[] {
    const keys = Object.keys(obj)
    const symbols = Object.getOwnPropertySymbols(obj).filter(symbol => Object.prototype.propertyIsEnumerable.call(obj, symbol))
    return [...keys, ...symbols] as (keyof T)[]
}
