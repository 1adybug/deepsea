import coreFilter from "core-js-pure/full/array/filter.js"
import coreIncludes from "core-js-pure/full/array/includes.js"
import corePush from "core-js-pure/full/array/push.js"
import coreSlice from "core-js-pure/full/array/slice.js"
import coreSome from "core-js-pure/full/array/some.js"
import coreToSpliced from "core-js-pure/full/array/to-spliced.js"
import coreUniqueBy from "core-js-pure/full/array/unique-by.js"
import coreWith from "core-js-pure/full/array/with.js"

import type { ArrayFunctions, ArrayReceiver, Equality } from "../api.js"

import { absoluteIndex, checkComparator, lengthOf, toObject } from "./internals/abstract.js"

const slice: ArrayFunctions["slice"] = coreSlice
const filter: ArrayFunctions["filter"] = coreFilter
const includes: ArrayFunctions["includes"] = coreIncludes
const push: ArrayFunctions["push"] = corePush
const some: ArrayFunctions["some"] = coreSome
const toSpliced: ArrayFunctions["toSpliced"] = coreToSpliced
const withValue: ArrayFunctions["with"] = coreWith
const uniqueBy: ArrayFunctions["uniqueBy"] = coreUniqueBy

export function chunk<T>(array: ArrayReceiver<T>, size: number): T[][] {
    const object = toObject(array)
    const length = lengthOf(object)
    if (!Number.isInteger(size) || size <= 0) throw new RangeError(`Invalid size : ${size}`)

    const result: T[][] = []

    for (let index = 0; index < length; index += size) push(result, slice(object, index, Math.min(index + size, length)))
    return result
}

export function nonNullable<T>(array: ArrayReceiver<T>): NonNullable<T>[] {
    return filter(array, (value): value is NonNullable<T> => value !== null && value !== undefined)
}

export function asNonNullable<T>(array: T[]): NonNullable<T>[]
export function asNonNullable<T>(array: readonly T[]): readonly NonNullable<T>[]

export function asNonNullable<T>(array: readonly T[]): readonly NonNullable<T>[] {
    return toObject(array) as readonly NonNullable<T>[]
}

export function toShifted<T>(array: ArrayReceiver<T>): T[] {
    return toSpliced(array, 0, 1)
}

export function toPopped<T>(array: ArrayReceiver<T>): T[] {
    return toSpliced(array, -1, 1)
}

export function toPushed<T>(array: ArrayReceiver<T>, ...items: T[]): T[] {
    return toSpliced(array, lengthOf(array), 0, ...items)
}

export function toUnshifted<T>(array: ArrayReceiver<T>, ...items: T[]): T[] {
    return toSpliced(array, 0, 0, ...items)
}

export function toExchange<T>(array: ArrayReceiver<T>, a: number, b: number): T[] {
    const object = toObject(array),
        length = lengthOf(object)

    const first = absoluteIndex(a, length),
        second = absoluteIndex(b, length)

    const firstValue = object[first]!,
        secondValue = object[second]!
    return withValue(withValue(object, first, secondValue), second, firstValue)
}

export function toDeduplicated<T>(array: ArrayReceiver<T>, compare?: Equality<T>): T[] {
    checkComparator(compare)
    if (!compare) return uniqueBy(array)

    const object = toObject(array),
        length = lengthOf(object),
        result: T[] = []

    for (let index = 0; index < length; index++) {
        const value = object[index]!
        if (!some(result, existing => compare(existing, value))) push(result, value)
    }

    return result
}

function contains<T>(array: ArrayReceiver<T>, value: T, compare?: Equality<T>): boolean {
    if (!compare) return includes(array, value)
    return some(array, existing => compare(existing, value))
}

export function difference<T>(array: ArrayReceiver<T>, values: ArrayReceiver<T>, compare?: Equality<T>): T[] {
    checkComparator(compare)
    const other = toObject(values)
    return filter(array, value => !contains(other, value, compare))
}

export function intersection<T>(array: ArrayReceiver<T>, values: ArrayReceiver<T>, compare?: Equality<T>): T[] {
    checkComparator(compare)
    const other = toObject(values)
    return filter(array, value => contains(other, value, compare))
}

export function union<T>(array: ArrayReceiver<T>, values: ArrayReceiver<T>, compare?: Equality<T>): T[] {
    checkComparator(compare)

    const object = toObject(array),
        other = toObject(values)

    const result = slice(object)

    // Keep the existing concatenation contract: duplicates already present in either operand are retained.
    for (let index = 0, length = lengthOf(other); index < length; index++) {
        if (!(index in other)) continue
        const value = other[index]!
        if (!contains(object, value, compare)) push(result, value)
    }

    return result
}

export function random<T>(array: ArrayReceiver<T>, start?: number, end?: number): T {
    const selected = slice(array, start, end)
    if (selected.length === 0) throw new Error("cant random an empty array")
    return selected[Math.floor(Math.random() * selected.length)]!
}

export function lastIndex<T>(array: ArrayReceiver<T>): number {
    return Math.max(lengthOf(array) - 1, 0)
}

export function lastItem<T>(array: ArrayReceiver<T>): T | undefined
export function lastItem<T>(array: ArrayReceiver<T>, value: T): T

export function lastItem<T>(array: ArrayReceiver<T>, value?: T): T | undefined {
    const object = toObject(array),
        length = lengthOf(object)

    if (arguments.length > 1) {
        ;(object as Record<number, T>)[length === 0 ? 0 : length - 1] = value as T
        return value
    }

    return length === 0 ? undefined : object[length - 1]
}
