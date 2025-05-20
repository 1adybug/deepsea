import { JSON2SheetOpts, utils, writeFile } from "xlsx"

export type { JSON2SheetOpts } from "xlsx"

export type WriteableWorkSheetCellData = string | number | Date | boolean | undefined | null

export type WriteableWorkSheetData = Record<string, WriteableWorkSheetCellData>[]

export type WriteableWorkBookData = Record<string, WriteableWorkSheetData>

export interface WriteSheetParams {
    /**
     * 导出的数据
     */
    data: WriteableWorkSheetData | WriteableWorkBookData
    /**
     * 导出的文件名
     */
    path: string
    /**
     * 导出的选项
     */
    jsonToSheetOptions?: JSON2SheetOpts
}

const defaultSheetName = "__DEFAULT_SHEET_NAME__"

/** 手动导出 excel */
export function writeSheet({ data, path, jsonToSheetOptions }: WriteSheetParams) {
    data = Array.isArray(data) ? { [defaultSheetName]: data } : data
    const workBook = utils.book_new()
    Object.entries(data).forEach(([key, value]) => {
        const workSheet = utils.json_to_sheet(value, jsonToSheetOptions)
        utils.book_append_sheet(workBook, workSheet, key === defaultSheetName ? undefined : key)
    })
    writeFile(workBook, path.replace(/^(.+?)\.xlsx?$/i, "$1.xlsx"))
}
