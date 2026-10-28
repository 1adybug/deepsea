import { describe, expect, it, vi } from "vitest"

import {
    assign,
    compareProperties,
    compareWithoutProperties,
    emptyWith,
    fiberToTree,
    getAll,
    getArray,
    getEnumerable,
    getNextFiber,
    getPagination,
    getPointToLineMinDistance,
    getProperties,
    getPropertiesIsModified,
    getSample,
    getUniqueBy,
    getWhere,
    merge,
    swap,
    toAdd,
    toDelete,
    treeToFiber,
    uniqueById,
    walkThroughFiber,
} from "../src/index"

describe("objects and collections", () => {
    it("assigns enumerable symbols, ignores undefined and mutates only the target", () => {
        const symbol = Symbol("visible")
        const source = Object.defineProperty({ a: undefined, b: null, [symbol]: 4 }, "hidden", { value: 1 })

        const target = { a: 2 }

        expect(assign(target, source)).toBe(target)
        expect(target).toEqual({ a: 2, b: null, [symbol]: 4 })
        expect(getEnumerable(source)).toEqual(["a", "b", symbol])
    })

    it("deeply merges disjoint objects without mutating their inputs", () => {
        const a = { nested: { a: 1, b: 2 }, nullable: { value: 1 } as { value: number } | null }

        const b = { nested: { a: 3, b: 2 }, nullable: null }

        expect(merge(a, b)).toEqual(b)
        expect(a.nested.a).toBe(1)
        expect(merge({ a: 1 }, { b: 2 } as never)).toEqual({ a: 1, b: 2 })
    })

    it("compares deep properties, excludes ignored keys and rejects empty key lists", () => {
        const a = { id: 1, data: { x: [1] } }

        const b = { id: 2, data: { x: [1] } }

        expect(compareProperties(a, b, "data")).toBe(true)
        expect(compareWithoutProperties(a, b, "id")).toBe(true)
        expect(getPropertiesIsModified(a, b)("id")).toBe(true)
        expect(getPropertiesIsModified(a, b)("data")).toBe(false)
        expect(getProperties(a, "id")).toEqual({ id: 1 })
        expect(() => compareProperties(a, b)).toThrow()
        expect(() => compareWithoutProperties(a, b)).toThrow()
    })

    it("builds arrays, evaluates fallback lazily and keeps the nonempty reference", () => {
        expect(getArray(3)).toEqual([0, 1, 2])
        expect(getArray(3, 0)).toEqual([0, 0, 0])
        expect(getArray(3, i => i * 2)).toEqual([0, 2, 4])
        const fallback = vi.fn(() => 9)

        const values = [1]

        expect(emptyWith(values, fallback)).toBe(values)
        expect(fallback).not.toHaveBeenCalled()
        expect(emptyWith([], fallback)).toEqual([9])
        expect(emptyWith([], 0)).toEqual([0])
    })

    it("deduplicates by key or selector from either end", () => {
        const values = [
            { id: 1, name: "first" },
            { id: 2, name: "second" },
            { id: 1, name: "last" },
        ]

        expect(values.filter(uniqueById)).toEqual(values.slice(0, 2))
        expect(values.filter(getUniqueBy("id", true))).toEqual(values.slice(1))
        expect(values.filter(getUniqueBy(item => item.id))).toEqual(values.slice(0, 2))
    })

    it("updates sets and swaps arrays immutably with identity for no-op set updates", () => {
        const set = new Set([1])
        expect(toAdd(set, 1)).toBe(set)
        expect(toDelete(set, 2)).toBe(set)
        expect([...toAdd(set, 2)]).toEqual([1, 2])
        expect([...toDelete(set, 1)]).toEqual([])
        expect([...set]).toEqual([1])

        const array = [1, 2, 3]

        expect(swap(array, 0, -1)).toEqual([3, 2, 1])
        expect(array).toEqual([1, 2, 3])
        expect(() => swap(array, -4, 1)).toThrow()
        expect(() => swap(array, 0.5, 1)).toThrow()
    })

    it("builds deduplicated keyword and range filters", () => {
        expect(getWhere({ name: "alpha beta alpha", status: "ready", age: [1, 9], ignored: undefined }, ["status"])).toEqual({
            AND: [{ name: { contains: "alpha" } }, { name: { contains: "beta" } }],
            status: "ready",
            age: { gte: 1, lte: 9 },
        })

        expect(getWhere({ name: "hello", status: "ready" }, ["name"], false)).toEqual({ AND: [{ name: { contains: "hello" } }], status: "ready" })
        expect(getWhere({ name: "   " })).toEqual({})
    })

    it("selects representative records without modifying the input", () => {
        const values = [{ a: 1 }, { a: 1 }, { a: 2 }]

        expect(getSample(values, 2)).toEqual([{ a: 1 }, { a: 2 }])
        expect(values).toHaveLength(3)
        expect(getSample(values, 0)).toEqual([])
        expect(getSample([])).toEqual([])
    })
})

describe("trees and geometry", () => {
    it("round-trips trees, links parents and walks depth-first across root siblings", () => {
        const tree = [{ id: "a", children: [{ id: "b", children: [{ id: "c" }] }, { id: "d" }] }, { id: "e" }]

        const fiber = treeToFiber(tree)!

        const visited: string[] = []

        walkThroughFiber(fiber, node => visited.push(node.id))
        expect(visited).toEqual(["a", "b", "c", "d", "e"])
        expect(fiber.child?.parent).toBe(fiber)
        expect(fiberToTree(fiber)).toEqual(tree)
        expect(getNextFiber(fiber.sibling!)).toBeNull()
        expect(() => walkThroughFiber(fiber.child!, () => {})).toThrow("not the root")
        expect(treeToFiber([])).toBeNull()
        expect(treeToFiber(null)).toBeNull()
    })

    it.each([
        [
            [1, 1],
            [
                [0, 0],
                [2, 0],
            ],
            1,
        ],
        [
            [1, 1],
            [
                [0, 0],
                [0, 2],
            ],
            1,
        ],
        [
            [1, 1],
            [
                [0, 0],
                [2, 2],
            ],
            0,
        ],
        [
            [3, 0],
            [
                [0, 0],
                [1, 0],
            ],
            2,
        ],
        [
            [3, 4],
            [
                [0, 0],
                [0, 0],
            ],
            5,
        ],
    ] as const)("computes point-to-segment distance", (point, line, distance) => {
        expect(
            getPointToLineMinDistance(
                [...point],
                line.map(p => [...p]),
            ),
        ).toBeCloseTo(distance)
    })

    it("rejects malformed geometry", () => {
        expect(() =>
            getPointToLineMinDistance(
                [0],
                [
                    [0, 0],
                    [1, 1],
                ],
            ),
        ).toThrow()

        expect(() => getPointToLineMinDistance([0, 0], [])).toThrow()
    })
})

describe("pagination", () => {
    it("keeps the current page within its navigation window at the eighth page", () => {
        const page = getPagination({ data: getArray(100), pageNum: 8, pageSize: 1 })
        expect(page.navigatepageNums).toContain(8)
        expect(page.navigateFirstPage).toBe(1)
        expect(page.navigateLastPage).toBe(8)
    })

    it("loads every page in order and stops when hasNextPage is false", async () => {
        const query = vi.fn(async (pageNum: number) => getPagination({ data: [1, 2, 3], pageNum, pageSize: 2 }))
        expect(await getAll(query)).toEqual([1, 2, 3])
        expect(query.mock.calls).toEqual([[1], [2]])
        const failure = new Error("offline")
        await expect(
            getAll(async () => {
                throw failure
            }),
        ).rejects.toBe(failure)
    })
})
