import { describe, expect, it } from "vitest"

import {
    booleanParser,
    dateParser,
    getEnumEntries,
    getEnumKey,
    getEnumKeys,
    getEnumOptions,
    getEnumParser,
    getEnumValues,
    getIntParser,
    getNaturalParser,
    getPositiveIntParser,
    intParser,
    naturalParser,
    positiveIntParser,
    stringToNumber,
} from "../src/index"

describe("strict parsers", () => {
    it.each([
        [undefined, undefined],
        [null, undefined],
        ["", undefined],
        [" ", undefined],
        ["1", 1],
        ["  -12 ", -12],
        ["0", 0],
        ["1.2", undefined],
        ["1e2", undefined],
        ["12px", undefined],
        ["Infinity", undefined],
    ])("parses integer %s", (input, expected) => {
        expect(intParser(input)).toBe(expected)
    })

    it.each([
        ["-1", undefined, undefined],
        ["0", 0, undefined],
        ["1", 1, 1],
        ["invalid", undefined, undefined],
    ] as const)("parses nonnegative and positive integer %s", (input, natural, positive) => {
        expect(naturalParser(input)).toBe(natural)
        expect(positiveIntParser(input)).toBe(positive)
    })

    it.each([
        ["TRUE", true],
        [" 1 ", true],
        ["false", false],
        ["0", false],
        ["yes", undefined],
        ["", undefined],
        [null, undefined],
    ] as const)("parses boolean %s", (input, expected) => {
        expect(booleanParser(input)).toBe(expected)
    })

    it("memoizes parsers by fallback and preserves valid zero", () => {
        for (const factory of [getIntParser, getNaturalParser, getPositiveIntParser]) {
            expect(factory(8)).toBe(factory(8))
            expect(factory(8)).not.toBe(factory(9))
            expect(factory(8)("bad")).toBe(8)
            expect(factory(8)("3")).toBe(3)
        }

        expect(getIntParser(8)("0")).toBe(0)
        expect(dateParser("0")?.getTime()).toBe(0)
        expect(dateParser("bad")).toBeUndefined()
    })

    it("supports permissive numeric conversion, fallback and clamping", () => {
        expect(stringToNumber("3.7")).toBe(3)
        expect(stringToNumber("bad", 9)).toBe(9)
        expect(stringToNumber("bad")).toBeNaN()
        expect(stringToNumber("3.7", { float: true, default: 0 })).toBe(3.7)
        expect(stringToNumber("-5", { min: 0, default: 2 })).toBe(0)
        expect(stringToNumber("99", { max: 10, default: 2 })).toBe(10)
    })
})

describe("enum helpers", () => {
    const numeric = { 0: "Idle", 1: "Ready", Idle: 0, Ready: 1 } as const
    const string = { Idle: "idle", Ready: "ready" } as const

    it("filters numeric reverse mappings and creates stable ordered options", () => {
        expect(getEnumEntries(numeric)).toEqual([
            ["Idle", 0],
            ["Ready", 1],
        ])

        expect(getEnumKeys(numeric)).toEqual(["Idle", "Ready"])
        expect(getEnumValues(numeric)).toEqual([0, 1])

        expect(getEnumOptions(string)).toEqual([
            { label: "Idle", value: "idle" },
            { label: "Ready", value: "ready" },
        ])

        expect(getEnumKey(string, "ready")).toBe("Ready")
        expect(getEnumEntries({})).toEqual([])
    })

    it("coerces known values and caches by enum identity and fallback", () => {
        const parse = getEnumParser(numeric, -1)
        expect(parse("1")).toBe(1)
        expect(parse(0)).toBe(0)
        expect(parse(null)).toBe(-1)
        expect(parse("other")).toBe(-1)
        expect(getEnumParser(numeric, -1)).toBe(parse)
        expect(getEnumParser(numeric, 2)).not.toBe(parse)
        expect(getEnumParser(string)("ready")).toBe("ready")
        expect(getEnumParser(string)("bad")).toBeUndefined()
    })
})
