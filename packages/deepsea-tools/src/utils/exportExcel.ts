import { utils, writeFile } from "xlsx"

export type ExcelItem = string | number | Date | boolean | undefined | null

export type ExcelData = Record<string, ExcelItem>[]

export interface ExportExcelParams {
    /**
     * 导出的数据
     */
    data: ExcelData
    /**
     * 导出的文件名
     */
    fileName: string
}

/** 手动导出 excel */
export function exportExcel({ data, fileName }: ExportExcelParams) {
    const workSheet = utils.json_to_sheet(data)
    const workBook = utils.book_new()
    utils.book_append_sheet(workBook, workSheet)
    writeFile(workBook, fileName.replace(/^(.+?)\.xlsx?$/i, "$1.xlsx"))
}
