import { ParsingOptions, Sheet2JSONOpts, read, utils } from "xlsx"

export type { ParsingOptions, Sheet2JSONOpts } from "xlsx"

/**
 * 工作簿的数据
 */
export type WorkBookData<Sheet = WorkSheetData> = {
    [sheetName: string]: Sheet
}

/**
 * 工作表的数据
 */
export type WorkSheetData = WorkSheetRowData[]

/**
 * 单元格的值
 */
export type WorkSheetCellValue = string | number | boolean | undefined

/**
 * 工作表的数据
 */
export type WorkSheetRowData = {
    /**
     * 第几行
     */
    __rowNum__: number
    /**
     * key 是表头，value 是单元格的值
     */
    [columnName: string]: WorkSheetCellValue
}

export interface ReadExcelParams {
    buffer: ArrayBuffer
    parsingOptions?: ParsingOptions
    sheetToJsonOptions?: Sheet2JSONOpts
}

/**
 * 读取工作簿
 * @param buffer 工作簿的二进制数据
 * @returns 工作簿的数据
 */
export function readExcel<Sheet = WorkSheetData>(bufferOrParams: ArrayBuffer | ReadExcelParams): WorkBookData<Sheet> {
    const { buffer, parsingOptions, sheetToJsonOptions } =
        bufferOrParams instanceof ArrayBuffer ? ({ buffer: bufferOrParams } as ReadExcelParams) : bufferOrParams
    const wb = read(buffer, parsingOptions)
    const result = wb.SheetNames.reduce((acc, item) => {
        acc[item] = utils.sheet_to_json(wb.Sheets[item], sheetToJsonOptions) as any
        return acc
    }, {} as WorkBookData<Sheet>)
    return result
}
