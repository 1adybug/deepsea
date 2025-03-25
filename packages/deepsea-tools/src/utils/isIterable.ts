import { isNonNullable } from "./isNonNullable"

export function isIterable<T = any>(value: unknown): value is Iterable<T> {
    return isNonNullable(value) && typeof (value as any)[Symbol.iterator] === "function"
}
