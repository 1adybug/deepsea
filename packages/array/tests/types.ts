import array, { arrayWith, filter, fromAsync, map } from "@1adybug/array"
import toSpliced from "@1adybug/array/pure/actual/to-spliced"
import chunk from "@1adybug/array/pure/full/array/chunk.js"
import virtualChunk from "@1adybug/array/pure/full/array/virtual/chunk"

import "@1adybug/array/types"

const strings: string[] = filter([1, "a"], (value): value is string => typeof value === "string")
const mapped: string[] = map([1, 2], value => value.toFixed())
const asyncValues: Promise<string[]> = fromAsync([Promise.resolve(1)], async value => value.toFixed())
const chunks: number[][] = chunk(Object.freeze([1, 2, 3]), 2)
const copied: number[] = toSpliced([1, 2], 0, 1)
const replaced: number[] = arrayWith([1, 2], -1, 3)
const namespace: number[] = array.with([1], 0, 2)
const virtual: number[][] = virtualChunk.call([1, 2], 1)

const readonlyValues: readonly (number | null)[] = [1, null]

const narrowed: readonly number[] = readonlyValues.asNonNullable()
const prototypeCopy: number[] = [1, 2].toSpliced()
const readonlyCopy: (number | null)[] = readonlyValues.toSpliced(0, undefined)
const globalAsync: Promise<number[]> = Array.fromAsync([Promise.resolve(1)])
declare const promisedAsync: AsyncIterable<Promise<number>>
const asyncPromises: Promise<Promise<number>[]> = fromAsync(promisedAsync)

readonlyValues.findLast((value, index, values) => {
    // @ts-expect-error callback receiver preserves readonly input
    values.push(value)

    return index > 0
})

// @ts-expect-error readonly input must not produce a mutable identity cast
const mutable: number[] = readonlyValues.asNonNullable()

// @ts-expect-error readonly accessors cannot mutate the receiver
readonlyValues.lastItem = 2

// @ts-expect-error inserted items must match the receiver element type
toSpliced([1, 2], 0, 1, "invalid")

void [strings, mapped, asyncValues, chunks, copied, replaced, namespace, virtual, narrowed, mutable, prototypeCopy, readonlyCopy, globalAsync, asyncPromises]
