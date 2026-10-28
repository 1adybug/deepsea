import { describe, expect, it } from "vitest"

import type { ArrayFunctions } from "../api"

import array from "../src/generated/pure/full/index"

const cases: Record<keyof ArrayFunctions, () => unknown> = {
    at: () => expect(array.at([1, 2, 3], -1.5)).toBe(3),
    concat: () => expect(array.concat([1], [2], 3)).toEqual([1, 2, 3]),
    copyWithin: () => expect(array.copyWithin([1, 2, 3], 0, 1)).toEqual([2, 3, 3]),
    entries: () =>
        expect([...array.entries(["a", "b"])]).toEqual([
            [0, "a"],
            [1, "b"],
        ]),
    every: () => expect(array.every([2, 4], value => value % 2 === 0)).toBe(true),
    fill: () => expect(array.fill([1, 2, 3], 0, 1, 2)).toEqual([1, 0, 3]),
    filter: () => expect(array.filter([1, 2, 3], value => value > 1)).toEqual([2, 3]),
    filterOut: () => expect(array.filterOut([1, 2, 3], value => value > 1)).toEqual([1]),
    filterReject: () => expect(array.filterReject([1, 2, 3], value => value > 1)).toEqual([1]),
    find: () => expect(array.find([1, 2, 3], value => value > 1)).toBe(2),
    findIndex: () => expect(array.findIndex([1, 2, 3], value => value > 1)).toBe(1),
    findLast: () => expect(array.findLast([1, 2, 3], value => value > 1)).toBe(3),
    findLastIndex: () => expect(array.findLastIndex([1, 2, 3], value => value > 1)).toBe(2),
    flat: () => expect(array.flat([1, [2, [3]]], 2)).toEqual([1, 2, 3]),
    flatMap: () => expect(array.flatMap([1, 2], value => [value, value])).toEqual([1, 1, 2, 2]),
    forEach: () => {
        const seen: number[] = []

        array.forEach([1, 2], value => seen.push(value))
        expect(seen).toEqual([1, 2])
    },
    from: () => expect(array.from(new Set([1, 2]), value => value * 2)).toEqual([2, 4]),
    fromAsync: async () => expect(await array.fromAsync([Promise.resolve(1), Promise.resolve(2)], async value => value * 2)).toEqual([2, 4]),
    group: () => expect({ ...array.group([1, 2, 3], value => (value % 2 ? "odd" : "even")) }).toEqual({ odd: [1, 3], even: [2] }),
    groupBy: () => expect({ ...array.groupBy([1, 2, 3], value => (value % 2 ? "odd" : "even")) }).toEqual({ odd: [1, 3], even: [2] }),
    groupToMap: () =>
        expect([...array.groupToMap([1, 2, 3], value => value % 2)]).toEqual([
            [1, [1, 3]],
            [0, [2]],
        ]),
    groupByToMap: () =>
        expect([...array.groupByToMap([1, 2, 3], value => value % 2)]).toEqual([
            [1, [1, 3]],
            [0, [2]],
        ]),
    includes: () => expect(array.includes([NaN], NaN)).toBe(true),
    indexOf: () => expect(array.indexOf([1, 2, 1], 1, 1)).toBe(2),
    isArray: () => expect(array.isArray({ length: 1 })).toBe(false),
    isTemplateObject: () => {
        const strings = ((value: TemplateStringsArray) => value)`literal`
        expect(array.isTemplateObject(strings)).toBe(true)
        expect(array.isTemplateObject(["literal"])).toBe(false)
    },
    iterator: () => expect([...array.iterator([1, 2])]).toEqual([1, 2]),
    join: () => expect(array.join(["a", "b"], "-")).toBe("a-b"),
    keys: () => expect([...array.keys(["a", "b"])]).toEqual([0, 1]),
    lastIndex: () => {
        expect(array.lastIndex([])).toBe(0)
        expect(array.lastIndex([1, 2])).toBe(1)
    },
    lastItem: () => {
        const values: number[] = []

        expect(array.lastItem(values)).toBeUndefined()
        expect(array.lastItem(values, 4)).toBe(4)
        expect(values).toEqual([4])
    },
    lastIndexOf: () => expect(array.lastIndexOf([1, 2, 1], 1)).toBe(2),
    map: () => expect(array.map({ 0: 2, 1: 3, length: 2 }, value => value * 2)).toEqual([4, 6]),
    of: () => expect(array.of(1, 2, 3)).toEqual([1, 2, 3]),
    pop: () => {
        const values = [1, 2]

        expect(array.pop(values)).toBe(2)
        expect(values).toEqual([1])
    },
    push: () => {
        const values = [1]

        expect(array.push(values, 2, 3)).toBe(3)
        expect(values).toEqual([1, 2, 3])
    },
    reduce: () => expect(array.reduce([1, 2, 3], (sum, value) => sum + value, 0)).toBe(6),
    reduceRight: () => expect(array.reduceRight(["a", "b"], (all, value) => all + value, "")).toBe("ba"),
    reverse: () => expect(array.reverse([1, 2, 3])).toEqual([3, 2, 1]),
    shift: () => {
        const values = [1, 2]

        expect(array.shift(values)).toBe(1)
        expect(values).toEqual([2])
    },
    slice: () => expect(array.slice([1, 2, 3], -2)).toEqual([2, 3]),
    some: () => expect(array.some([1, 2, 3], value => value === 2)).toBe(true),
    sort: () => expect(array.sort([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3]),
    splice: () => {
        const values = [1, 2, 3]

        expect(array.splice(values, 1, 1, 4)).toEqual([2])
        expect(values).toEqual([1, 4, 3])
    },
    toLocaleString: () => expect(array.toLocaleString([{ toLocaleString: () => "value" }, null])).toBe("value,"),
    toString: () => expect(array.toString([1, 2, 3])).toBe("1,2,3"),
    toReversed: () => expect(array.toReversed([1, 2, 3])).toEqual([3, 2, 1]),
    toSorted: () => expect(array.toSorted([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3]),
    toSpliced: () => expect(array.toSpliced([1, 2, 3], 1, undefined, 4)).toEqual([1, 4, 2, 3]),
    uniqueBy: () =>
        expect(
            array.uniqueBy(
                [
                    { id: 1, value: 1 },
                    { id: 1, value: 2 },
                ],
                value => value.id,
            ),
        ).toEqual([{ id: 1, value: 1 }]),
    unshift: () => {
        const values = [3]

        expect(array.unshift(values, 1, 2)).toBe(3)
        expect(values).toEqual([1, 2, 3])
    },
    values: () => expect([...array.values([1, 2])]).toEqual([1, 2]),
    with: () => expect(array.with([1, 2, 3], -1, 4)).toEqual([1, 2, 4]),
    chunk: () => expect(array.chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]),
    nonNullable: () => expect(array.nonNullable([0, false, "", null, undefined])).toEqual([0, false, ""]),
    asNonNullable: () => {
        const values = [1, null]

        expect(array.asNonNullable(values)).toBe(values)
    },
    toShifted: () => expect(array.toShifted([1, 2, 3])).toEqual([2, 3]),
    toPopped: () => expect(array.toPopped([1, 2, 3])).toEqual([1, 2]),
    toPushed: () => expect(array.toPushed([1], 2, 3)).toEqual([1, 2, 3]),
    toUnshifted: () => expect(array.toUnshifted([3], 1, 2)).toEqual([1, 2, 3]),
    toExchange: () => expect(array.toExchange([1, 2, 3], 0, -1)).toEqual([3, 2, 1]),
    toDeduplicated: () => expect(array.toDeduplicated([1, 1, 2])).toEqual([1, 2]),
    difference: () => expect(array.difference([1, 2, 3], [2])).toEqual([1, 3]),
    intersection: () => expect(array.intersection([1, 2, 3], [2])).toEqual([2]),
    union: () => expect(array.union([1, 2], [2, 3])).toEqual([1, 2, 3]),
    random: () => expect(array.random([1])).toBe(1),
}

describe("complete Array operation coverage", () => {
    it("has a behavioral oracle for every exported operation", () => {
        expect(Object.keys(cases).sort()).toEqual(Object.keys(array).sort())
    })

    for (const [name, run] of Object.entries(cases)) {
        it(name, async () => {
            await run()
        })
    }
})
