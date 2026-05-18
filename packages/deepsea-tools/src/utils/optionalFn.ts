import type { AnyFunction } from "./createFnWithMiddleware"

const defaultFn = () => undefined

export function optionalFn(fn?: undefined): () => undefined
export function optionalFn<T extends AnyFunction>(fn: T): T
export function optionalFn<T extends AnyFunction>(fn?: T | undefined): (...args: Parameters<T>) => ReturnType<T> | undefined
export function optionalFn<T extends AnyFunction>(fn?: T | undefined): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return fn ?? defaultFn
}
