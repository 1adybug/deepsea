import { writeSheet, WriteSheetParams } from "./writeSheet"

/**
 * @deprecated 请使用 WriteSheetParams 代替
 */
export type WriteExcelParams = WriteSheetParams

/**
 * @deprecated 请使用 writeSheet 代替
 */
export const writeExcel = writeSheet
