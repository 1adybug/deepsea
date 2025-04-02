"use client"

import { FC } from "react"
import { WorkBookData, WorkSheetData, readExcel } from "deepsea-tools"

import { InputFile, InputFileProps } from "./InputFile"

export interface ReadExcelProps extends Omit<InputFileProps<false, "arrayBuffer">, "multiple" | "accept" | "type" | "onValueChange"> {
    onValueChange?: <Sheet = WorkSheetData>(data: WorkBookData<Sheet>) => void
}

/** 专门用于读取 excel 的组件 */
export const ReadExcel: FC<ReadExcelProps> = props => {
    const { onValueChange, ...rest } = props

    return <InputFile accept=".xlsx" type="arrayBuffer" onValueChange={data => onValueChange?.(readExcel(data))} {...rest} />
}
