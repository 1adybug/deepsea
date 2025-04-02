"use client"

import { ComponentProps, JSX, JSXElementConstructor, MouseEvent as ReactMouseEvent, createElement } from "react"
import { WriteExcelParams, writeExcel } from "deepsea-tools"

export type WriteExcelProps<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button"> = Omit<ComponentProps<AS>, "as" | "excel"> & {
    as?: AS
    excel?: WriteExcelParams
}

/** 导出 excel 的 button 组件 */
export function WriteExcel<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button">(props: WriteExcelProps<AS>) {
    const { as, excel, onClick: _onClick, ...rest } = props

    function onClick(e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
        _onClick?.(e)
        if (!excel) return
        writeExcel(excel)
    }

    return createElement(as ?? "button", {
        onClick,
        ...rest,
    })
}
