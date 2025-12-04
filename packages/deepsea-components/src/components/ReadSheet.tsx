"use client"

import { FC } from "react"

import { readSheet, WorkBookData, WorkSheetData } from "deepsea-tools"

import { InputFile, InputFileProps } from "./InputFile"

export interface ReadSheetProps extends Omit<InputFileProps<false, "arrayBuffer">, "multiple" | "accept" | "type" | "onValueChange"> {
    onValueChange?: <Sheet = WorkSheetData>(data: WorkBookData<Sheet>) => void
}

/** 专门用于读取 excel 的组件 */
export const ReadSheet: FC<ReadSheetProps> = props => {
    const { onValueChange, ...rest } = props

    return <InputFile accept=".xlsx" type="arrayBuffer" onValueChange={data => onValueChange?.(readSheet(data))} {...rest} />
}
