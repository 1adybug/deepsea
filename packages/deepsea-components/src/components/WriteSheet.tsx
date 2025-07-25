"use client"

import { WriteSheetParams, writeSheet } from "deepsea-tools"
import { ComponentProps, JSX, JSXElementConstructor, MouseEvent as ReactMouseEvent, createElement } from "react"

export type WriteSheetProps<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button"> = Omit<ComponentProps<AS>, "as" | "excel"> & {
    as?: AS
    excel?: WriteSheetParams
}

/** 导出 excel 的 button 组件 */
export function WriteSheet<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "button">(props: WriteSheetProps<AS>) {
    const { as, excel, onClick: _onClick, ...rest } = props

    function onClick(e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
        _onClick?.(e)
        if (!excel) return
        writeSheet(excel)
    }

    return createElement(as ?? "button", {
        onClick,
        ...rest,
    })
}
