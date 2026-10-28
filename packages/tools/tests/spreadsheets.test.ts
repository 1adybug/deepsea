import * as XLSX from "@1adybug/xlsx"
import { describe, expect, it, vi } from "vitest"

import { readExcel, readSheet, writeExcel, writeSheet } from "../src/index"

vi.mock("@1adybug/xlsx", async importOriginal => ({ ...(await importOriginal<typeof XLSX>()), writeFile: vi.fn() }))

describe("worksheet helpers", () => {
    it("reads multiple sheets with Unicode and raw primitive values", () => {
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet([{ name: "测试", count: 0, ready: false }]), "Data")
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["id"], [2]]), "Other")
        const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer
        expect(readSheet(buffer)).toEqual({ Data: [{ name: "测试", count: 0, ready: false }], Other: [{ id: 2 }] })
        expect(readSheet({ buffer, sheetToJsonOptions: { header: 1 } }).Other).toEqual([["id"], [2]])
        expect(readExcel).toBe(readSheet)
    })

    it("writes named sheets, default sheets and normalizes XLS extensions", () => {
        writeSheet({ data: { Data: [{ id: 1 }], Empty: [] }, path: "report.XLS" })
        expect(XLSX.writeFile).toHaveBeenCalledWith(expect.objectContaining({ SheetNames: ["Data", "Empty"] }), "report.xlsx")
        writeSheet({ data: [{ name: "A" }], path: "other.xlsx", jsonToSheetOptions: { skipHeader: true } })
        const workbook = vi.mocked(XLSX.writeFile).mock.lastCall![0]
        expect(workbook.SheetNames).toEqual(["Sheet1"])
        expect(workbook.Sheets.Sheet1.A1.v).toBe("A")
        expect(writeExcel).toBe(writeSheet)
    })
})
