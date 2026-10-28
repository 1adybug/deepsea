import { describe, expect, it, vi } from "vitest"

import array, { extendArrayPrototype } from "../src/index"

describe("standard Array semantics", () => {
    it("distinguishes omitted arguments from explicit undefined", () => {
        const values = Object.freeze([1, 2, 3])
        expect(array.toSpliced(values)).toEqual([1, 2, 3])
        expect(array.toSpliced(values, 1)).toEqual([1])
        expect(array.toSpliced(values, 1, undefined)).toEqual([1, 2, 3])
        expect(array.at(values, 1.9)).toBe(2)
        expect(array.at(values, NaN)).toBe(1)
        expect(array.at(values, Infinity)).toBeUndefined()
        expect(array.with(values, -1.9, 4)).toEqual([1, 2, 4])
    })

    it("preserves holes for map/slice while change-by-copy methods materialize them", () => {
        const values = Array<number>(3)
        values[1] = 2
        expect(0 in array.map(values, value => value * 2)).toBe(false)
        expect(0 in array.slice(values)).toBe(false)
        for (const copied of [array.toReversed(values), array.toSorted(values), array.toSpliced(values), array.with(values, 1, 3)])
            expect(Object.keys(copied)).toHaveLength(3)
        const chunks = array.chunk(values, 2)
        expect(chunks.map(chunk => chunk.length)).toEqual([2, 1])
        expect(0 in chunks[0]!).toBe(false)
    })

    it("respects species for legacy methods and returns plain Arrays for copy methods", () => {
        class Derived extends Array<number> {}
        const values = new Derived(1, 2, 3)
        expect(array.map(values, value => value * 2)).toBeInstanceOf(Derived)
        expect(array.toReversed(values)).not.toBeInstanceOf(Derived)
        expect(array.toSorted(values)).not.toBeInstanceOf(Derived)
    })

    it("does not read deleted or replaced indices", () => {
        const values = [1, 2, 3]

        Object.defineProperty(values, 0, {
            get() {
                throw new Error("must not read")
            },
        })

        expect(array.with(values, 0, 4)).toEqual([4, 2, 3])
        expect(array.toShifted(values)).toEqual([2, 3])
    })

    it("awaits asynchronous iterables and rejects invalid callbacks", async () => {
        async function* source() {
            yield 1
            yield 2
        }

        expect(await array.fromAsync(source(), async value => value + 1)).toEqual([2, 3])
        expect(() => array.map([], null as never)).toThrow(TypeError)
        expect(() => array.toSorted([], null as never)).toThrow(TypeError)
        expect(() => array.with([1], 1, 0)).toThrow(RangeError)
    })
})

describe("custom extensions", () => {
    it("uses SameValueZero and supports comparator-based collection operations", () => {
        expect(array.toDeduplicated([NaN, NaN, 0, -0])).toEqual([NaN, 0])
        expect(array.difference([NaN, 1], [NaN])).toEqual([1])
        expect(array.intersection([NaN, NaN, 1], [NaN])).toEqual([NaN, NaN])
        expect(array.union([1, 1], [2, 2])).toEqual([1, 1, 2, 2])

        const first = { id: 1 },
            second = { id: 1 }

        const equal = (a: typeof first, b: typeof first) => a.id === b.id
        expect(array.toDeduplicated([first, second], equal)).toEqual([first])
        expect(array.difference([first], [second], equal)).toEqual([])
        expect(array.intersection([first], [second], equal)).toEqual([first])
        expect(() => array.toDeduplicated([], null as never)).toThrow(TypeError)
    })

    it("keeps source arrays immutable and handles empty arrays and relative indices", () => {
        const values = Object.freeze([1, 2, 3])
        expect(array.toExchange(values, 0.9, -1.9)).toEqual([3, 2, 1])
        expect(array.toPushed(values, 4)).toEqual([1, 2, 3, 4])
        expect(array.toUnshifted(values, 0)).toEqual([0, 1, 2, 3])
        expect(array.toPopped([])).toEqual([])
        expect(array.toShifted([])).toEqual([])
        expect(values).toEqual([1, 2, 3])
        expect(() => array.toExchange([], 0, 0)).toThrow(RangeError)
        expect(() => array.chunk([1], Infinity)).toThrow(RangeError)
        expect(() => array.chunk(null as never, 2)).toThrow(TypeError)
    })

    it("skips comparator operands' holes and reads appended getters once", () => {
        const sparse = Array<{ id: number }>(2)
        sparse[1] = { id: 1 }
        const compare = (left: { id: number }, right: { id: number }) => left.id === right.id
        expect(array.intersection([{ id: 1 }], sparse, compare)).toEqual([{ id: 1 }])
        expect(array.difference([{ id: 2 }], sparse, compare)).toEqual([{ id: 2 }])
        let reads = 0

        const values = {
            length: 1,
            get 0() {
                reads++
                return reads
            },
        }

        expect(array.union([], values)).toEqual([1])
        expect(reads).toBe(1)
    })

    it("selects random values within slice boundaries without mutating data", () => {
        const random = vi.spyOn(Math, "random").mockReturnValue(0)
        expect(array.random([1, 2, 3], 1)).toBe(2)
        random.mockReturnValue(0.999999)
        expect(array.random([1, 2, 3], 0, 2)).toBe(2)
        expect(() => array.random([], 0)).toThrow("cant random an empty array")
        random.mockRestore()
    })

    it("installs non-enumerable methods, correct unscopables, statics and accessors idempotently", () => {
        extendArrayPrototype()
        const original = Array.prototype.chunk
        extendArrayPrototype()
        expect(Array.prototype.chunk).toBe(original)
        expect(Array.prototype.chunk.name).toBe("chunk")
        expect(Array.prototype.chunk.length).toBe(1)
        expect(Object.getOwnPropertyDescriptor(Array.prototype, "chunk")).toMatchObject({ enumerable: false, writable: true, configurable: true })
        expect(Array.prototype[Symbol.unscopables].chunk).toBe(true)
        expect(Object.keys([1, 2])).toEqual(["0", "1"])
        expect(Array.isTemplateObject([1])).toBe(false)

        const values: number[] = []

        expect(values.lastIndex).toBe(0)
        values.lastItem = 5
        expect(values).toEqual([5])
        expect(values.lastItem).toBe(5)
    })
})
