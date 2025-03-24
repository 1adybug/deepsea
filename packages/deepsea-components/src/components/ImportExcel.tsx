"use client"

import { FC } from "react"
import { readExcel } from "deepsea-tools"

import { InputFile, InputFileProps } from "./InputFile"

export interface ImportExcelProps extends Omit<InputFileProps<false, "arrayBuffer">, "multiple" | "accept" | "type" | "onValueChange"> {
    onValueChange?: (data: Record<string, any>[]) => void
}

/** 专门用于读取 excel 的组件 */
export const ImportExcel: FC<ImportExcelProps> = props => {
    const { onValueChange, ...rest } = props

    return <InputFile accept=".xlsx" type="arrayBuffer" onValueChange={data => onValueChange?.(readExcel(data))} {...rest} />
}
