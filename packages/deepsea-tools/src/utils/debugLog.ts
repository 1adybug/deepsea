import { StrKeyOf } from "soda-type"

export function debugLog<T>(value: T): T {
    if (process.env.NODE_ENV === "development") console.log(value)
    return value
}

export function debugDir<T>(value: T): T {
    if (process.env.NODE_ENV === "development") console.dir(value)
    return value
}

export function debugTable<T, K extends StrKeyOf<T>>(value: T, properties?: K[]): T {
    if (process.env.NODE_ENV === "development") console.table(value, properties)
    return value
}
