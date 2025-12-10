"use client"

import { ComponentProps, CSSProperties, FC, ForwardedRef, useEffect, useEffectEvent, useImperativeHandle, useLayoutEffect, useRef } from "react"

import { css } from "@emotion/css"
import { clsx } from "deepsea-tools"
import Scrollbar from "smooth-scrollbar"
import type { ScrollbarOptions, ScrollListener } from "smooth-scrollbar/interfaces"

import { px, transformCSSVariable } from "@/utils"

export { default as Scrollbar } from "smooth-scrollbar"

export * from "smooth-scrollbar/interfaces"

export interface ScrollOptions extends Partial<ScrollbarOptions> {
    /** 滑块宽度 */
    thumbWidth?: number | string
    /** 滑块圆角大小 */
    thumbRadius?: number | string
    /** 滑块背景颜色 */
    thumbColor?: CSSProperties["backgroundColor"]
    /** 滚动条背景颜色 */
    trackColor?: CSSProperties["backgroundColor"]
}

export interface ScrollProps extends ComponentProps<"div"> {
    /** 滚动的配置 */
    options?: ScrollOptions
    /** 滚动条实例 */
    scrollbar?: ForwardedRef<Scrollbar>
    /** 滚动条滚动事件 */
    onScrollbar?: ScrollListener
}

export const Scroll: FC<ScrollProps> = ({
    ref,
    children,
    options: { thumbWidth, thumbRadius, thumbColor, trackColor, ...scrollbarOptions } = {},
    className,
    scrollbar,
    onScrollbar,
    style,
    ...rest
}) => {
    const ele = useRef<HTMLDivElement>(null)
    const bar = useRef<Scrollbar | null>(null)

    useLayoutEffect(() => {
        bar.current = Scrollbar.init(ele.current!, scrollbarOptions)
        return () => bar.current?.destroy()
    }, [])

    useImperativeHandle(ref, () => ele.current!, [])

    useImperativeHandle(scrollbar, () => bar.current!, [])

    const onScrollbarListener = useEffectEvent(onScrollbar ?? (() => void 0))

    useEffect(() => {
        bar.current?.addListener(onScrollbarListener)
        return () => bar.current?.removeListener(onScrollbarListener)
    }, [])

    const style2 = css`
        .scrollbar-track.scrollbar-track-x {
            ${thumbWidth !== undefined ? "height: var(--thumb-width);" : ""}
            ${trackColor !== undefined ? "background-color: var(--track-color);" : ""}
        }

        .scrollbar-thumb.scrollbar-thumb-x {
            ${thumbWidth !== undefined ? "height: var(--thumb-width);" : ""}
            ${thumbRadius !== undefined ? "border-radius: var(--thumb-radius);" : ""} 
            ${thumbColor !== undefined ? "background-color: var(--thumb-color);" : ""}
        }

        .scrollbar-track.scrollbar-track-y {
            ${thumbWidth !== undefined ? "width: var(--thumb-width);" : ""}
            ${trackColor !== undefined ? "background-color: var(--track-color);" : ""}
        }

        .scrollbar-thumb.scrollbar-thumb-y {
            ${thumbWidth !== undefined ? "width: var(--thumb-width);" : ""}
            ${thumbRadius !== undefined ? "border-radius: var(--thumb-radius);" : ""} 
            ${thumbColor !== undefined ? "background-color: var(--thumb-color);" : ""}
        }
    `

    return (
        <div
            ref={ele}
            className={clsx(style2, className)}
            style={transformCSSVariable(
                {
                    thumbWidth: px(thumbWidth),
                    thumbRadius: px(thumbRadius),
                    thumbColor,
                    trackColor,
                },
                style,
            )}
            {...rest}
        >
            {children}
        </div>
    )
}
