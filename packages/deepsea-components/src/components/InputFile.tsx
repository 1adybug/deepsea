"use client"

import { ChangeEvent, ComponentProps, ReactNode, useState } from "react"

export interface InputFileDataTypeMap {
    base64: string
    text: string
    arrayBuffer: ArrayBuffer
    binary: string
    file: File
}

export type InputFileDataType = keyof InputFileDataTypeMap

export async function getFileData<T extends InputFileDataType>(file: File, type: T): Promise<InputFileDataTypeMap[T]> {
    const fileReader = new FileReader()
    switch (type) {
        case "arrayBuffer":
            fileReader.readAsArrayBuffer(file)
            break
        case "binary":
            fileReader.readAsBinaryString(file)
            break
        case "base64":
            fileReader.readAsDataURL(file)
            break
        case "text":
            fileReader.readAsText(file)
            break
        default:
            return file as any
    }
    return new Promise(resolve => {
        fileReader.addEventListener("load", () => {
            resolve(fileReader.result as any)
        })
    })
}

export interface InputFileBaseProps extends Omit<ComponentProps<"input">, "multiple" | "type"> {}

export type FileType<Multiple extends boolean> = Multiple extends true ? File[] : File
export type ValueType<Multiple extends boolean, Type extends InputFileDataType> = Multiple extends true
    ? InputFileDataTypeMap[Type][]
    : InputFileDataTypeMap[Type]

export interface InputFileExtraProps<Multiple extends boolean = false, Type extends InputFileDataType = "file"> {
    multiple?: Multiple
    type?: Type
    onValueChange?: (data: ValueType<Multiple, Type>) => void
    onFileChange?: (data: FileType<Multiple>) => void
    /** 是否在捕获文件后清除 input 上的文件，默认为 false，主要区别在于如果不清除，连续两次选择同样的文件不会触发 onChange 事件，如果用于 form 表单，请设置为 flase */
    clearAfterChange?: boolean
}

export interface InputFileProps<Multiple extends boolean = false, Type extends InputFileDataType = "file">
    extends InputFileBaseProps,
        InputFileExtraProps<Multiple, Type> {}

/** 专用于读取文件的组件 */
export function InputFile<Multiple extends boolean = false, Type extends InputFileDataType = "file">(props: InputFileProps<Multiple, Type>): ReactNode {
    const { multiple = false, type = "file", onChange: _onChange, disabled: _disabled, clearAfterChange, onValueChange, onFileChange, ...rest } = props
    const [disabled, setDisabled] = useState(false)

    async function onChange(e: ChangeEvent<HTMLInputElement>) {
        _onChange?.(e)
        const input = e.target
        const { files } = input
        if (!files || files.length === 0) return
        setDisabled(true)
        try {
            if (multiple) {
                const files2: File[] = Array.from(files)
                const values: InputFileDataTypeMap[Type][] = []
                for (const file of files2) {
                    const value = (await getFileData(file, type)) as InputFileDataTypeMap[Type]
                    values.push(value)
                }
                onFileChange?.(files2 as FileType<Multiple>)
                onValueChange?.(values as ValueType<Multiple, Type>)
            } else {
                const file = files[0]
                onFileChange?.(file as FileType<Multiple>)
                onValueChange?.((await getFileData(file, type)) as ValueType<Multiple, Type>)
            }
        } finally {
            if (clearAfterChange) input.value = ""
            setDisabled(false)
        }
    }

    return <input disabled={disabled || _disabled} type="file" multiple={multiple} onChange={onChange} {...rest} />
}
