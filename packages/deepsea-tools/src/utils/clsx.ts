import { ClassValue, clsx as _clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { isNullable } from "./isNullable"

function isClassNames(value: any) {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.values(value).every(item => typeof item === "string" || item === undefined || item === null)
    )
}

/**
 * 让 clsx 支持 tailwindcss 和 classNames 的合并
 * @param inputs 类名或者 classNames 对象
 * @returns 合并后的类名或者 classNames 对象
 */
export function clsx<T extends Record<string, string | undefined | null>>(...inputs: (T | undefined | null)[]): T
export function clsx(...inputs: ClassValue[]): string
export function clsx(...inputs: any[]) {
    if (inputs.every(item => isClassNames(item) || item === undefined || item === null)) {
        return inputs.reduce((acc: Record<string, string>, item: Record<string, string | undefined | null> | undefined | null) => {
            if (isNullable(item)) return acc
            Object.entries(item).forEach(([key, value]) => (acc[key] = twMerge(_clsx(acc[key], value))))
            return acc
        }, {})
    }
    return twMerge(_clsx(...inputs))
}
