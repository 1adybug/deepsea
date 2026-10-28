import { Fragment } from "react"

import { describe, expect, it, vi } from "vitest"

import { isReactNode } from "../src/utils/isReactNode"
import { renderToText } from "../src/utils/renderToText"
import { renderToWorkSheetCell } from "../src/utils/renderToWorkSheetCell"

describe("node validation and text conversion", () => {
    it.each([undefined, null, false, true, 0, NaN, 1n, "", <span key="a" />])("accepts a supported child %s", value => {
        expect(isReactNode(value)).toBe(true)
    })

    it.each([{}, new Date(), Symbol("x"), () => 1, Promise.resolve(1)])("rejects unsupported values %s", value => {
        expect(isReactNode(value)).toBe(false)
    })

    it("checks every nested iterable member", () => {
        expect(isReactNode(new Set([new Set([1, "two"])]))).toBe(true)
        expect(isReactNode(new Set([new Set([{}])]))).toBe(false)
    })

    it.each([
        [null, ""],
        [undefined, ""],
        [false, ""],
        [true, ""],
        [0, "0"],
        [42n, "42"],
        ["<&>", "<&>"],
    ] as const)("converts primitive %s", (input, expected) => {
        expect(renderToText(input)).toBe(expected)
    })

    it("extracts nested markup text and decodes escaped entities", () => {
        const node = (
            <Fragment>
                <strong>A &amp; B</strong>
                <span> &lt;C&gt;</span>
            </Fragment>
        )

        expect(renderToText(node)).toBe("A & B <C>")
        expect(renderToWorkSheetCell(node)).toBe("A & B <C>")
    })

    it("reports invalid React children and returns empty text", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {})
        expect(renderToText(Symbol("bad") as never)).toBe("")
        expect(renderToText((() => 1) as never)).toBe("")
        expect(error).toHaveBeenCalledTimes(2)
    })
})
