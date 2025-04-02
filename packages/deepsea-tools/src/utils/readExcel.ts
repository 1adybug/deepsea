import { read, utils } from "xlsx"

/**
 Excel 的数据
 */
export type ReadExcelData = {
    [sheetName: string]: ReadSheetData[]
}

export type ReadExcelValue = string | number | boolean | undefined

/**
 * 工作表的数据
 */
export type ReadSheetData = {
    /**
     * 第几行
     */
    __rowNum__: number
    /**
     * key 是表头，value 是单元格的值
     */
    [columnName: string]: ReadExcelValue
}

export function readExcel(buffer: ArrayBuffer): ReadExcelData {
    const wb = read(buffer)
    const result = wb.SheetNames.reduce((acc, item) => {
        acc[item] = utils.sheet_to_json<any>(wb.Sheets[item])
        return acc
    }, {} as ReadExcelData)
    return result
}
