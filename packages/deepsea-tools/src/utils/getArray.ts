import { AnyFunction } from "./createFnWithMiddleware"

/**
 * 获得一个函数循环出来的数组
 * @param {number} length - 数组的长度
 * 1. 不传第二个参数时，会返回一个 index 的数组，比如 getArray(3) => [0, 1, 2]
 * 2. 传入一个函数时，会返回一个根据函数生成的数组，比如 getArray(3, index => index * 2) => [0, 2, 4]
 * 3. 传入一个值时，会返回一个根据值生成的数组，比如 getArray(3, 2) => [2, 2, 2]
 */
export function getArray(length: number): number[]
export function getArray<T>(length: number, fun: (index: number) => T): T[]
export function getArray<T>(length: number, item: T): (T extends AnyFunction ? never : T)[]
export function getArray<T>(length: number, fun?: any): (T | number)[] {
    return Array(length)
        .fill(0)
        .map((item, index) => (typeof fun === "function" ? fun(index) : (fun ?? index)))
}
