import { isNonNullable } from "./isNonNullable"

export function isNullable<T>(value: T): value is Exclude<T, NonNullable<T>> {
    return !isNonNullable(value)
}
