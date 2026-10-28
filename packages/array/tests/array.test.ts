import { describe, expect, it } from "vitest"

import { extendArrayPrototype } from "../src/index"

extendArrayPrototype()

describe("array extensions", () => {
    it("chunks without mutating input and rejects invalid sizes", () => {
        const values = [1, 2, 3, 4, 5]

        expect(values.chunk(2)).toEqual([[1, 2], [3, 4], [5]])
        expect(values).toEqual([1, 2, 3, 4, 5])
        expect(() => values.chunk(0)).toThrow(RangeError)
        expect(() => values.chunk(1.5)).toThrow(RangeError)
    })

    it("deduplicates objects with a comparator and keeps extension installation idempotent", () => {
        const values = [{ id: 1 }, { id: 1 }, { id: 2 }]

        expect(values.toDeduplicated((a, b) => a.id === b.id)).toEqual([{ id: 1 }, { id: 2 }])
        const original = Array.prototype.chunk
        extendArrayPrototype()
        expect(Array.prototype.chunk).toBe(original)
        expect([1, 2, 3].difference([2])).toEqual([1, 3])
        expect([0, false, "", null, undefined].nonNullable()).toEqual([0, false, ""])
    })
})
