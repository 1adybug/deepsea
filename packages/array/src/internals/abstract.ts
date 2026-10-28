import type { ArrayReceiver, Equality } from "../../api.js"

export function toObject<T>(value: ArrayReceiver<T>): ArrayReceiver<T> {
    if (value === null || value === undefined) throw new TypeError("Cannot convert null or undefined to object")
    return Object(value)
}

export function toLength(value: unknown): number {
    const number = +(value as number)
    if (Number.isNaN(number) || number <= 0) return 0
    return Math.min(Math.floor(number), Number.MAX_SAFE_INTEGER)
}

export function lengthOf<T>(array: ArrayReceiver<T>): number {
    return toLength(toObject(array).length)
}

export function absoluteIndex(index: number, length: number): number {
    const number = +index
    const integer = Number.isNaN(number) ? 0 : Math.trunc(number)
    const result = integer < 0 ? length + integer : integer
    if (result < 0 || result >= length) throw new RangeError("Invalid array index")
    return result
}

export function checkComparator<T>(compare: Equality<T> | undefined) {
    if (compare !== undefined && typeof compare !== "function") throw new TypeError("Comparator must be callable")
}
