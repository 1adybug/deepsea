"use client"

import { readSheet, WorkBookData, WorkSheetData } from "deepsea-tools"

import { InputFile, InputFileProps } from "./InputFile"

export interface ReadSheetProps<Sheet = WorkSheetData> extends Omit<InputFileProps<false, "arrayBuffer">, "multiple" | "accept" | "type" | "onValueChange"> {
    onValueChange?: (data: WorkBookData<Sheet>) => void
}

/** 专门用于读取 excel 的组件 */
export function ReadSheet<Sheet = WorkSheetData>({ onValueChange, ...rest }: ReadSheetProps<Sheet>) {
    return <InputFile accept=".xlsx" type="arrayBuffer" onValueChange={data => onValueChange?.(readSheet(data))} {...rest} />
}
