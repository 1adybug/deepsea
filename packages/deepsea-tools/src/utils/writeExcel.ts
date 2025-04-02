import { utils, writeFile } from "xlsx"

export type WriteExcelItem = string | number | Date | boolean | undefined | null

export type WriteExcelData = Record<string, WriteExcelItem>[]

export interface WriteExcelParams {
    /**
     * 导出的数据
     */
    data: WriteExcelData | Record<string, WriteExcelData>
    /**
     * 导出的文件名
     */
    path: string
}

const defaultSheetName = "__DEFAULT_SHEET_NAME__"

/** 手动导出 excel */
export function writeExcel({ data, path }: WriteExcelParams) {
    data = Array.isArray(data) ? { [defaultSheetName]: data } : data
    const workBook = utils.book_new()
    Object.entries(data).forEach(([key, value]) => {
        const workSheet = utils.json_to_sheet(value)
        utils.book_append_sheet(workBook, workSheet, key === defaultSheetName ? undefined : key)
    })
    writeFile(workBook, path.replace(/^(.+?)\.xlsx?$/i, "$1.xlsx"))
}
