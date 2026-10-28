import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { test } from "node:test"

import * as XLSX from "../packages/xlsx/xlsx.mjs"

const require = createRequire(import.meta.url)

for (const [format, library] of [
    ["ESM", XLSX],
    ["CJS", require("../packages/xlsx/xlsx.js")],
]) {
    test(`${format}: spreadsheet binary round-trip preserves Unicode, numbers and booleans`, () => {
        const rows = [{ name: "格数", count: 3, enabled: true }]

        const book = library.utils.book_new()
        library.utils.book_append_sheet(book, library.utils.json_to_sheet(rows), "数据")
        const binary = library.write(book, { type: "buffer", bookType: "xlsx" })
        const restored = library.read(binary, { type: "buffer" })
        assert.deepEqual(library.utils.sheet_to_json(restored.Sheets["数据"]), rows)
    })
}
