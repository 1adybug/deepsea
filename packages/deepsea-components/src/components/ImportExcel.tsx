"use client"

import { forwardRef } from "react"
import { readExcel } from "deepsea-tools"

import { InputFile, InputFileProps } from "./InputFile"

export interface ImportExcelProps extends Omit<InputFileProps, "multiple" | "onChange" | "accept" | "type"> {
    onChange?: (data: Record<string, any>[]) => void
}

/** 专门用于读取 excel 的组件 */
export const ImportExcel = forwardRef<HTMLInputElement, ImportExcelProps>((props, ref) => {
    const { onChange, ...rest } = props

    return <InputFile ref={ref} accept=".xlsx" type="arrayBuffer" onChange={({ result }) => onChange?.(readExcel(result))} {...rest} />
})
