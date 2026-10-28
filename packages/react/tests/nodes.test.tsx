import { expect, it } from "vitest"

import { isReactNode } from "../src/utils/isReactNode"
import { renderToText } from "../src/utils/renderToText"
import { renderToWorkSheetCell } from "../src/utils/renderToWorkSheetCell"

it("recognizes nested React nodes and rejects non-renderable objects", () => {
    expect(isReactNode(["text", 0, false, null, <span key="item">child</span>])).toBe(true)
    expect(isReactNode(new Set(["one", "two"]))).toBe(true)
    expect(isReactNode(["text", { invalid: true }])).toBe(false)
    expect(isReactNode(Symbol("invalid"))).toBe(false)
})

it("preserves worksheet primitives, large integers and empty values", () => {
    expect(renderToWorkSheetCell(0)).toBe(0)
    expect(renderToWorkSheetCell(false)).toBe(false)
    expect(renderToWorkSheetCell(9007199254740993n)).toBe("9007199254740993")
    expect(renderToWorkSheetCell({ invalid: true })).toBe("")
    expect(renderToText(null)).toBe("")
    expect(renderToText("格数")).toBe("格数")
})
