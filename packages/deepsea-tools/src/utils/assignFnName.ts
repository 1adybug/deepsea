import { AnyFunction } from "./createFnWithMiddleware"

/**
 * 将 source 的函数名赋值给 target
 * @param target 目标函数
 * @param source 源函数
 */
export function assignFnName<T extends AnyFunction>(target: T, source: AnyFunction | string): T {
    const name = typeof source === "string" ? source : source.name
    Object.defineProperty(target, "name", { value: name })
    return target
}
