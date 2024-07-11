import { getEnumerable } from "./getEnumerable"

export type Combine<A, B> = B extends undefined ? A : B

export type Assign<A extends {}, B extends {}> = {
    [K in keyof A | keyof B]: K extends keyof A ? (K extends keyof B ? Combine<A[K], B[K]> : A[K]) : K extends keyof B ? B[K] : never
}

/**
 * 合并两个对象，如果两个对象有相同的键，那么后者的值会覆盖前者的值，和 Object.assign 的区别是，Object.assign 会忽略 undefined 值，而这个函数不会
 * @param a 第一个对象
 * @param b 第二个对象
 * @returns 合并后的对象
 */
export function assign<A extends {}>(a: A): A
export function assign<A extends {}, B extends {}>(a: A, b: B): Assign<A, B>
export function assign<A extends {}, B extends {}, C extends {}>(a: A, b: B, c: C): Assign<Assign<A, B>, C>
export function assign<A extends {}, B extends {}, C extends {}, D extends {}>(a: A, b: B, c: C, d: D): Assign<Assign<Assign<A, B>, C>, D>
export function assign(a: object, ...sources: object[]): any
export function assign(a: object, ...sources: object[]): any {
    if (sources.length === 0) return a
    const [b, ...rest] = sources
    const keys = getEnumerable(b)
    for (const key of keys) {
        const value = b[key]
        if (value === undefined) continue
        a[key] = value
        return a
    }
    if (rest.length === 0) return a
    return assign(a, ...rest)
}
