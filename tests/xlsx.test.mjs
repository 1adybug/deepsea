import assert from "node:assert/strict"
import * as fs from "node:fs"
import { mkdtemp, rm } from "node:fs/promises"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { Readable } from "node:stream"
import { test } from "node:test"

import * as XLSX from "../packages/xlsx/xlsx.mjs"

const require = createRequire(import.meta.url)

for (const variant of ["core", "full", "mini"]) {
    test(`${variant} bundle: writes callback-only async workbooks through the published entry`, async t => {
        const library = require(`../packages/xlsx/dist/xlsx.${variant}.min.js`)
        library.set_fs(fs)
        const root = await mkdtemp(join(tmpdir(), "deepsea-xlsx-bundle-"))
        t.after(() => rm(root, { recursive: true, force: true }))
        const book = library.utils.book_new()
        library.utils.book_append_sheet(book, library.utils.json_to_sheet([{ id: 1 }]), "Data")
        const path = join(root, "callback.xlsx")
        await new Promise((resolve, reject) => library.writeFileAsync(path, book, error => (error ? reject(error) : resolve())))
        assert.deepEqual(library.utils.sheet_to_json(library.readFile(path).Sheets.Data), [{ id: 1 }])
    })
}

for (const [format, library] of [
    ["ESM", XLSX],
    ["CJS", require("../packages/xlsx/xlsx.js")],
]) {
    library.set_fs?.(fs)
    library.stream.set_readable(Readable)

    test(`${format}: spreadsheet binary round-trip preserves Unicode, numbers and booleans`, () => {
        const rows = [{ name: "测试", count: 3, enabled: true }]

        const book = library.utils.book_new()
        library.utils.book_append_sheet(book, library.utils.json_to_sheet(rows), "数据")
        const binary = library.write(book, { type: "buffer", bookType: "xlsx" })
        const restored = library.read(binary, { type: "buffer" })
        assert.deepEqual(library.utils.sheet_to_json(restored.Sheets["数据"]), rows)
    })

    test(`${format}: cell, column, row and range addresses round-trip across boundaries`, () => {
        for (const column of [0, 25, 26, 701, 702, 16383]) assert.equal(library.utils.decode_col(library.utils.encode_col(column)), column)
        for (const row of [0, 9, 1048575]) assert.equal(library.utils.decode_row(library.utils.encode_row(row)), row)
        assert.deepEqual(library.utils.decode_cell(library.utils.encode_cell({ r: 9, c: 26 })), { r: 9, c: 26 })
        assert.deepEqual(library.utils.split_cell("$AA$10"), ["$AA", "$10"])
        assert.equal(library.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 9, c: 26 } }), "A1:AA10")
        assert.deepEqual(library.utils.decode_range("A1:AA10"), { s: { r: 0, c: 0 }, e: { r: 9, c: 26 } })
    })

    test(`${format}: constructs and appends sheets, sets metadata and validates workbook names`, () => {
        const sheet = library.utils.sheet_new()

        library.utils.sheet_add_aoa(sheet, [
            ["name", "count"],
            ["one", 1],
        ])

        library.utils.sheet_add_json(sheet, [{ name: "two", count: 2 }], { origin: -1, skipHeader: true })

        assert.deepEqual(library.utils.sheet_to_json(sheet), [
            { name: "one", count: 1 },
            { name: "two", count: 2 },
        ])

        const cell = library.utils.sheet_get_cell(sheet, "B2")
        library.utils.cell_set_number_format(cell, "0.00")
        assert.equal(library.utils.format_cell(cell), "1.00")
        library.utils.cell_set_hyperlink(cell, "https://example.test", "link")
        assert.equal(cell.l.Target, "https://example.test")
        library.utils.cell_set_internal_link(cell, "Data!A1")
        assert.equal(cell.l.Target, "#Data!A1")
        library.utils.cell_add_comment(cell, "note", "Tester")
        assert.equal(cell.c[0].t, "note")
        library.utils.sheet_set_array_formula(sheet, "C2:C3", "B2:B3*2")
        assert.match(library.utils.sheet_to_formulae(sheet).join("\n"), /B2:B3\*2/)
        const workbook = library.utils.book_new()
        library.utils.book_append_sheet(workbook, sheet, "Data")
        assert.throws(() => library.utils.book_append_sheet(workbook, sheet, "Data"))
        assert.throws(() => library.utils.book_append_sheet(workbook, sheet, "Invalid/Name"))
        library.utils.book_set_sheet_visibility(workbook, "Data", library.utils.consts.SHEET_HIDDEN)
        assert.equal(workbook.Workbook.Sheets[0].Hidden, library.utils.consts.SHEET_HIDDEN)
    })

    for (const bookType of ["xlsx", "xlsb", "biff8", "ods", "fods", "csv", "txt", "html", "sylk", "dif", "xml"]) {
        test(`${format}: ${bookType} writer and parser preserve tabular values`, () => {
            const workbook = library.utils.book_new()

            library.utils.book_append_sheet(
                workbook,
                library.utils.aoa_to_sheet([
                    ["label", "count"],
                    ["Alpha", 3],
                    ["Beta", 0],
                ]),
                "Data",
            )

            const binary = library.write(workbook, { type: "buffer", bookType })
            const restored = library.read(binary, { type: "buffer" })

            assert.deepEqual(library.utils.sheet_to_json(restored.Sheets[restored.SheetNames[0]]), [
                { label: "Alpha", count: 3 },
                { label: "Beta", count: 0 },
            ])
        })
    }

    test(`${format}: escapes CSV and HTML and supports JSON projections`, () => {
        const sheet = library.utils.aoa_to_sheet([
            ["label", "count"],
            ["a,b", 1],
            ['say "hi"', 2],
            ["<&>", 3],
        ])

        assert.match(library.utils.sheet_to_csv(sheet), /"a,b"/)
        assert.match(library.utils.sheet_to_csv(sheet), /"say ""hi"""/)
        assert.match(library.utils.sheet_to_html(sheet), /&lt;&amp;&gt;/)
        assert.equal(typeof library.utils.sheet_to_txt(sheet), "string")
        assert.deepEqual(library.utils.sheet_to_json(sheet, { header: 1 })[0], ["label", "count"])
        assert.deepEqual(library.utils.sheet_to_row_object_array(sheet), library.utils.sheet_to_json(sheet))
    })

    test(`${format}: filesystem APIs read and write actual workbook files`, async t => {
        const root = await mkdtemp(join(tmpdir(), "deepsea-xlsx-"))
        t.after(() => rm(root, { recursive: true, force: true }))
        const workbook = library.utils.book_new()
        library.utils.book_append_sheet(workbook, library.utils.json_to_sheet([{ id: 1 }]), "Data")

        for (const [name, writer] of [
            ["writeFile", library.writeFile],
            ["writeFileSync", library.writeFileSync],
            ["writeFileXLSX", library.writeFileXLSX],
        ]) {
            const path = join(root, `${name}.xlsx`)
            writer(workbook, path)
            assert.deepEqual(library.utils.sheet_to_json(library.readFile(path).Sheets.Data), [{ id: 1 }])
            assert.deepEqual(library.utils.sheet_to_json(library.readFileSync(path).Sheets.Data), [{ id: 1 }])
        }

        const path = join(root, "async.xlsx")
        await new Promise((resolve, reject) => library.writeFileAsync(path, workbook, {}, error => (error ? reject(error) : resolve())))
        assert.deepEqual(library.readFile(path).SheetNames, ["Data"])
        await new Promise((resolve, reject) => library.writeFileAsync(path, workbook, error => (error ? reject(error) : resolve())))
        assert.deepEqual(library.readFile(path).SheetNames, ["Data"])
        const binary = library.writeXLSX(workbook, { type: "buffer" })
        assert.deepEqual(library.read(binary).SheetNames, ["Data"])
    })

    test(`${format}: streams JSON, CSV, HTML and XML without buffering an input workbook`, async () => {
        const sheet = library.utils.json_to_sheet([{ name: "Alpha", count: 1 }])

        const rows = []

        for await (const row of library.stream.to_json(sheet)) rows.push(row)
        assert.deepEqual(rows, [{ name: "Alpha", count: 1 }])

        for (const [name, expected] of [
            ["to_csv", /Alpha,1/],
            ["to_html", /<table/],
        ]) {
            let output = ""
            for await (const chunk of library.stream[name](sheet)) output += chunk
            assert.match(output, expected)
        }

        const workbook = library.utils.book_new()
        library.utils.book_append_sheet(workbook, sheet, "Data")
        let xml = ""
        for await (const chunk of library.stream.to_xlml(workbook)) xml += chunk
        assert.match(xml, /<Workbook/)
    })

    test(`${format}: SSF formats values and CFB serializes containers`, () => {
        assert.equal(library.SSF.format("0.00", 1.2), "1.20")
        assert.equal(library.SSF.parse_date_code(1).d, 1)
        const container = library.CFB.utils.cfb_new()
        library.CFB.utils.cfb_add(container, "data.txt", Buffer.from("test"))
        const bytes = library.CFB.write(container, { type: "buffer" })
        const restored = library.CFB.read(bytes, { type: "buffer" })
        assert.equal(Buffer.from(library.CFB.find(restored, "data.txt").content).toString(), "test")
    })
}
