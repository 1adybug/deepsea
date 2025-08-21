import { clsx } from "./clsx"
import { isNullable } from "./isNullable"

/**
 * 让 clsx 支持 tailwindcss 和 classNames 的合并
 * @param inputs classNames 对象
 * @returns 合并后的 classNames 对象
 */
export function clsm<T extends string>(...inputs: (Partial<Record<T, string | undefined | null>> | undefined | null)[]): Partial<Record<T, string>> {
    return inputs.reduce((acc: Record<string, string>, item: Record<string, string | undefined | null> | undefined | null) => {
        if (isNullable(item)) return acc
        Object.entries(item).forEach(([key, value]) => (acc[key] = clsx(acc[key], value)))
        return acc
    }, {}) as Partial<Record<T, string>>
}
