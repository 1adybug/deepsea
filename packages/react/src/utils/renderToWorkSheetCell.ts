import type { WriteableWorkSheetCellData } from "@1adybug/tools"

import { isReactNode } from "./isReactNode"
import { renderToText } from "./renderToText"

export function renderToWorkSheetCell(value: unknown): WriteableWorkSheetCellData {
    if (!isReactNode(value)) return ""
    if (typeof value === "object") return renderToText(value)
    if (typeof value === "bigint") return value.toString()
    return value
}
