"use client"

import {
    ComponentProps,
    ComponentRef,
    createElement,
    DragEvent,
    Fragment,
    JSX,
    JSXElementConstructor,
    MouseEvent as ReactMouseEvent,
    useRef,
    useState,
} from "react"
import { FileType, getFileData, InputFile, InputFileBaseProps, InputFileDataType, InputFileDataTypeMap, InputFileExtraProps, ValueType } from "./InputFile"

export type InputFileButtonProps<
    Multiple extends boolean = false,
    Type extends InputFileDataType = "file",
    AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button",
> = Omit<ComponentProps<AS>, "as" | "type" | "disabled"> &
    InputFileExtraProps<Multiple, Type> & {
        disabled?: boolean
        inputProps?: Omit<InputFileBaseProps, "accept">
        accept?: string
        dragFile?: boolean
        as?: AS
    }

/** 专用于读取文件的 button 组件 */
export function InputFileButton<
    Multiple extends boolean = false,
    Type extends InputFileDataType = "file",
    AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button",
>(props: InputFileButtonProps<Multiple, Type, AS>) {
    const {
        as = "button",
        onClick: _onClick,
        inputProps = {},
        accept,
        onDrop: _onDrop,
        onDragOver: _onDragOver,
        dragFile,
        disabled: _disabled,
        type = "file",
        multiple,
        onValueChange,
        onFileChange,
        clearAfterChange,
        ...rest
    } = props

    const { style, disabled: __disabled, ...restInputProps } = inputProps
    const [disabled, setDisabled] = useState(false)
    const input = useRef<HTMLInputElement>(null)

    function onClick(e: ReactMouseEvent<ComponentRef<AS>, MouseEvent>) {
        input.current?.click()
        _onClick?.(e as any)
    }

    async function onDrop(e: DragEvent<ComponentRef<AS>>) {
        _onDrop?.(e as any)
        if (disabled || !dragFile) return
        e.preventDefault()
        const { files } = e.dataTransfer
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
            setDisabled(false)
        }
    }

    function onDragOver(e: DragEvent<ComponentRef<AS>>) {
        _onDragOver?.(e as any)
        if (disabled || !dragFile) return
        e.preventDefault()
    }

    return (
        <Fragment>
            <InputFile<Multiple, Type>
                disabled={disabled || _disabled || __disabled}
                style={{ display: "none", ...style }}
                multiple={multiple}
                accept={accept}
                type={type as Type}
                onValueChange={onValueChange}
                onFileChange={onFileChange}
                clearAfterChange={clearAfterChange}
                {...restInputProps}
            />
            {createElement(as, {
                disabled: disabled || _disabled,
                onClick,
                onDrop,
                onDragOver,
                ...rest,
            })}
        </Fragment>
    )
}
