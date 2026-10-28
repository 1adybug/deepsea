import dayjs from "dayjs"
import { afterEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import * as tools from "../src/index"

afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    tools.setFormatTimeDayjs(dayjs)
})

describe("strings, colors and value guards", () => {
    it("handles empty strings, case conversion, keyword matching and line widths", () => {
        expect(tools.capitalize("deepsea")).toBe("Deepsea")
        expect(tools.uncapitalize("Deepsea")).toBe("deepsea")
        expect(tools.capitalize("")).toBe("")
        expect(tools.uncapitalize("")).toBe("")
        expect(tools.satisfyKeyword("Hello World", "WORLD hello")).toBe(true)
        expect(tools.satisfyKeyword("Hello", "world")).toBe(false)
        expect(tools.satisfyKeyword("Hello", "  ")).toBe(true)
        expect(tools.stringToArray("a")).toEqual(["a"])

        const array = ["a"]

        expect(tools.stringToArray(array)).toBe(array)
        expect(tools.splitTextToLines("abcdef", { maxWidth: 1 })).toEqual(["ab", "cd", "ef"])
        expect(tools.splitTextToLines("测试文本", { maxWidth: 1 })).toEqual(["测", "试", "文", "本"])
        expect(tools.splitTextToLines("abcdefghi", { maxWidth: 3, maxLines: 1 })).toEqual(["abc..."])
        expect(tools.isFullWidthChar("测")).toBe(true)
        expect(tools.isFullWidthChar("a")).toBe(false)
        expect(() => tools.isFullWidthChar("ab")).toThrow()
    })

    it.each([
        ["#abc", "#aabbcc", 1],
        ["AABBCC", "#aabbcc", 1],
        ["#aabbcc80", "#aabbcc", 128 / 255],
        ["rgb(1, 2, 3)", "#010203", 1],
        ["rgba(1, 2, 3, .5)", "#010203", 0.5],
    ])("parses color %s", (input, hex, alpha) => {
        const color = new tools.Color(input)
        expect(color.toString("HEX")).toBe(hex)
        expect(color.a).toBe(alpha)
        expect(new tools.Color(color.toString("HEXA")).a).toBeCloseTo(alpha, 2)
        expect(color.toString()).toContain(alpha === 1 ? "rgb(" : "rgba(")
    })

    it("validates color channels and supports chained mutations", () => {
        const color = new tools.Color("#000")
        expect(color.setR(255).setG(128).setB(1).setA(0.5)).toBe(color)
        expect(color.toString("RGBA")).toBe("rgba(255, 128, 1, 0.5)")
        expect(color.toString("RGB")).toBe("rgb(255, 128, 1)")

        for (const value of [-1, 256, 1.5, NaN]) {
            expect(() => color.setR(value)).toThrow(TypeError)
            expect(() => color.setG(value)).toThrow(TypeError)
            expect(() => color.setB(value)).toThrow(TypeError)
        }

        expect(() => color.setA(2)).toThrow(TypeError)
        for (const input of ["red", "#ggg", "rgb(256,0,0)"]) expect(() => new tools.Color(input)).toThrow(TypeError)
    })

    it.each([null, undefined, false, 0, "", {}, [], new Set()])("classifies nullability and iterability of %s", value => {
        expect(tools.isNullable(value)).toBe(value === null || value === undefined)
        expect(tools.isNonNullable(value)).toBe(value !== null && value !== undefined)
        expect(tools.isIterable(value)).toBe(typeof value === "string" || Array.isArray(value) || value instanceof Set)
    })

    it("recognizes plain objects, arrays and async generators", () => {
        expect(tools.isPlainObject({})).toBe(true)
        expect(tools.isPlainObject(new Date())).toBe(false)
        expect(tools.isPlainObject(null)).toBe(false)
        expect(tools.isNotEmpty([])).toBe(false)
        expect(tools.isNotEmpty([0])).toBe(true)
        expect(tools.isNotEmpty(null)).toBe(false)

        expect(
            tools.isAsyncGenerator(
                (async function* () {
                    yield
                })(),
            ),
        ).toBe(true)

        expect(tools.isAsyncGenerator(Promise.resolve())).toBe(false)
        expect(tools.twoNumberIsEqual(0.1 + 0.2, 0.3)).toBe(true)
        expect(tools.twoNumberIsEqual(NaN, NaN)).toBe(true)
        expect(tools.twoNumberIsEqual(NaN, 1)).toBe(false)
    })

    it("merges Tailwind classes and slot classes without mutating inputs", () => {
        expect(tools.clsx("p-2", ["p-4"], { "text-sm": true, hidden: false })).toBe("p-4 text-sm")
        expect(tools.clsm(null, { root: "p-2" }, { root: "p-4", label: "font-bold" })).toEqual({ root: "p-4", label: "font-bold" })
    })

    it("computes normalized remainders and SVG arc direction flags", () => {
        expect(tools.getRemain(-4, 2)).toBe(0)
        expect(tools.getRemain(-1, 4)).toBe(3)
        expect(tools.getRemain(5, 4)).toBe(1)
        expect(tools.drawArc(0, 0, 10, 0, Math.PI / 2)).toMatch(/^M 10 0 A 10 10 0 0 1 /)
        expect(tools.drawArc(0, 0, 10, Math.PI, 0, { line: true, anticlockwise: true })).toContain("A 10 10 0 0 0")
    })
})

describe("errors and diagnostics", () => {
    it("formats Zod errors with unique messages and structured paths", () => {
        const schema = z.object({ a: z.string({ error: "required" }), b: z.string({ error: "required" }) })
        const result = schema.safeParse({})
        if (result.success) throw new Error("Expected invalid data")
        expect(tools.isZodError(result.error)).toBe(true)
        expect(tools.isZodError({ issues: [] })).toBe(false)
        expect(tools.flattenZodError(result.error)).toEqual(["required"])
        expect(tools.flattenZodError({ error: result.error, withPath: true })).toEqual([{ message: "required", path: ["a", "b"] }])
        expect(tools.flattenZodError({ error: result.error, isUnique: false })).toEqual(["required", "required"])

        expect(tools.flattenZodError({ error: result.error, withPath: true, isUnique: false })).toEqual([
            { message: "required", path: "a" },
            { message: "required", path: "b" },
        ])

        expect(tools.getErrorMessage(result.error)).toBe("required")
    })

    it("normalizes unknown failures and distinguishes aborts", () => {
        for (const [input, expected] of [
            [new Error("failed"), "failed"],
            [null, "null"],
            [42, "42"],
            ["text", "text"],
        ])
            expect(tools.getErrorMessage(input)).toBe(expected)

        expect(tools.getErrorMessage("Failed to fetch")).toContain("网络")
        expect(tools.isAbortError(new DOMException("aborted", "AbortError"))).toBe(true)
        expect(tools.isAbortError(new Error("AbortError"))).toBe(false)
        const html = tools.prettierError({ error: new Error("test failure"), source: "unit", time: "fixed time" })
        expect(html).toContain("test failure")
        expect(html).toContain("unit")
        expect(html).toContain("fixed time")
    })

    it("logs only in development while returning the same input", () => {
        const value = { id: 1 }

        const log = vi.spyOn(console, "log").mockImplementation(() => {})
        const dir = vi.spyOn(console, "dir").mockImplementation(() => {})
        const table = vi.spyOn(console, "table").mockImplementation(() => {})
        vi.stubEnv("NODE_ENV", "production")
        expect(tools.debugLog(value)).toBe(value)
        tools.debugDir(value)
        tools.debugTable(value)
        expect(log).not.toHaveBeenCalled()
        expect(dir).not.toHaveBeenCalled()
        expect(table).not.toHaveBeenCalled()
        vi.stubEnv("NODE_ENV", "development")
        tools.debugLog(value)
        tools.debugDir(value)
        tools.debugTable(value, ["id"])
        expect(log).toHaveBeenCalledWith(value)
        expect(dir).toHaveBeenCalledWith(value)
        expect(table).toHaveBeenCalledWith(value, ["id"])
        expect(tools.optionalFn()()).toBeUndefined()
        const fn = () => 1
        expect(tools.optionalFn(fn)).toBe(fn)
        expect(tools.assignFnName(fn, "renamed").name).toBe("renamed")
    })
})

describe("dates, random generators and identity fixtures", () => {
    it("formats fixed dates using the configured dayjs factory", () => {
        const date = new Date(2024, 1, 29, 12, 34, 56)
        expect(tools.formatTime(date)).toBe("2024-02-29 12:34:56")
        expect(tools.formatTime(date, "YYYY")).toBe("2024")
        const factory = vi.fn(dayjs)
        tools.setFormatTimeDayjs(factory as typeof dayjs)
        tools.formatTime(date)
        expect(factory).toHaveBeenCalledWith(date)
        expect([1, 2, 4].map(tools.getMonthLength)).toEqual([31, 28, 30])
    })

    it("checks a known checksum and extracts masked identity fields", () => {
        const id = "11010519491231002X"
        expect(tools.getIdChecksum(id)).toBe("X")
        expect(tools.isLegalId(id, true)).toBe(true)
        expect(tools.isLegalId(id.slice(0, -1) + "0", true)).toBe(false)
        expect(tools.isLegalId("bad")).toBe(false)
        expect(tools.coverIdWithMosaics(id)).toBe("110105********002X")
        expect(tools.getSexFromId(id)).toBe(0)
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2026, 0, 1))
        expect(tools.getAgeFromId(id)).toBe(77)
        expect(tools.showTotal(0)).toContain("0")
    })

    it("uses inclusive random bounds and validates impossible ranges", () => {
        const random = vi.spyOn(Math, "random").mockReturnValue(0)
        expect(tools.getRandomBetween(1, 3)).toBe(1)
        random.mockReturnValue(0.999999)
        expect(tools.getRandomBetween(1, 3)).toBe(3)
        expect(tools.getRandomBetween(2, 2)).toBe(2)
        expect(() => tools.getRandomBetween(2, 1)).toThrow()
        expect(() => tools.getRandomBetween(0.5, 2)).toThrow()
        expect(tools.getRandomItemFromArray(["a", "b"])).toBe("b")
        expect(() => tools.getRandomItemFromArray([])).toThrow()
        expect(tools.possibility(0)).toBe(false)
        expect(tools.possibility(1)).toBe(true)
    })

    it("generates deterministic, correctly shaped synthetic records", () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2026, 0, 1))
        vi.spyOn(Math, "random").mockReturnValue(0)
        expect(tools.getRandomYear()).toBe(2006)
        expect(tools.getRandomDate()).toBe("0101")
        expect(tools.getRandomId(110000)).toBe("110000200601010000")
        expect(() => tools.getRandomId(1)).toThrow()
        expect(() => tools.getRandomId(110000.5)).toThrow()
        expect(tools.getRandomName()).toMatch(/^.{2,3}$/u)
        expect(tools.getRandomPhone()).toMatch(/^1[35789]\d{9}$/)
        expect(tools.getRandomPlateNo("测试")).toMatch(/^测试[A-Z0-9]{5}$/)
        expect(tools.nanoid()).toHaveLength(6)
        expect(tools.nanoid(17)).toHaveLength(17)
        expect(tools.nanoid(0)).toBe("")
    })
})
