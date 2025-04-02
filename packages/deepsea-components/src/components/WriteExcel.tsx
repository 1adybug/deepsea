"use client"

import { ComponentProps, JSX, JSXElementConstructor, MouseEvent as ReactMouseEvent, createElement } from "react"
import { WriteExcelParams, writeExcel } from "deepsea-tools"

export type WriteExcelProps<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button"> = Omit<ComponentProps<AS>, "as" | "data"> & {
    as?: AS
    data: WriteExcelParams
}

/** 导出 excel 的 button 组件 */
export function WriteExcel<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button">(props: WriteExcelProps<AS>) {
    const { as, data, onClick: _onClick, ...rest } = props

    function onClick(e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
        writeExcel(data)
        _onClick?.(e)
    }

    return createElement(as ?? "button", {
        onClick,
        ...rest,
    })
}
