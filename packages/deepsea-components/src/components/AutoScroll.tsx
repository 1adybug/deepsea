"use client"

import { CSSProperties, FC, MouseEvent as ReactMouseEvent, useEffect, useEffectEvent, useImperativeHandle, useRef } from "react"

import { css } from "@emotion/css"
import { clsx, getArray } from "deepsea-tools"
import Scrollbar from "smooth-scrollbar"
import { ScrollStatus } from "smooth-scrollbar/interfaces/scrollbar"
import { useSize } from "soda-hooks"

import { px, transformCSSVariable } from "@/utils"

import { Scroll, ScrollProps } from "./Scroll"

export interface AutoScrollProps extends ScrollProps {
    /** 轮播元素的个数 */
    count: number

    /** 轮播元素的尺寸（垂直滚动时为高度，水平滚动时为宽度） */
    itemSize: number

    /**
     * 轮播动画的时间，单位毫秒
     * @default 1000
     */
    animation?: number

    /**
     * 每个元素的停留时间，单位毫秒
     * @default 3000
     */
    duration?: number

    /**
     * 元素之间的间距
     * @default 0
     */
    gap?: number

    /** 容器类名 */
    containerClassName?: string

    /** 容器样式 */
    containerStyle?: CSSProperties

    /**
     * 滚动方向
     * @default vertical
     */
    direction?: "vertical" | "horizontal"

    /**
     * 在鼠标移入时是否继续播放
     * @default false
     */
    playOnMouseEnter?: boolean

    /**
     * 是否暂停
     * @default false
     */
    paused?: boolean
}

export const AutoScroll: FC<AutoScrollProps> = ({
    ref,
    count,
    itemSize,
    animation = 1000,
    duration = 3000,
    onMouseEnter,
    onMouseLeave,
    gap = 0,
    containerClassName,
    containerStyle,
    children,
    playOnMouseEnter,
    scrollbar,
    paused,
    direction = "vertical",
    ...rest
}) => {
    const isVertical = direction === "vertical"
    const bar = useRef<Scrollbar | null>(null)
    const timeout = useRef<NodeJS.Timeout | undefined>(undefined)
    const ele = useRef<HTMLDivElement>(null)
    const size = useSize(ele)
    const pausedRef = useRef(false)
    const getPaused = useEffectEvent(() => paused)

    useImperativeHandle(ref, () => ele.current!, [])
    useImperativeHandle(scrollbar, () => bar.current!, [])

    useEffect(() => {
        if (playOnMouseEnter) pausedRef.current = false
    }, [playOnMouseEnter])

    useEffect(() => {
        if (!size || count === 0) return
        const containerSize = isVertical ? size.height : size.width
        if (itemSize === 0 || containerSize === 0) return
        const range = getArray(count, index => (itemSize + gap) * (index + 1) - (index === count - 1 ? gap : 0))
        const scrollLength = range.at(-1)!

        // 如果容器大小大于滚动长度，则不进行滚动
        if (containerSize >= scrollLength) return

        function scroll(target: number) {
            clearTimeout(timeout.current)
            timeout.current = setTimeout(() => {
                if (pausedRef.current || getPaused()) return scroll(target)
                bar.current?.scrollTo(isVertical ? 0 : target, isVertical ? target : 0, animation)
            }, duration)
        }

        scroll(range[0])

        function listener(status: ScrollStatus) {
            const offset = isVertical ? status.offset.y : status.offset.x
            const scrollToEnd = Math.abs(offset + containerSize - scrollLength) / itemSize <= 0.05
            const target = scrollToEnd ? 0 : range.find(item => item > offset)!
            scroll(target)
        }

        bar.current?.addListener(listener)

        return () => {
            clearTimeout(timeout.current)
            bar.current?.removeListener(listener)
            bar.current?.scrollTo(0, 0)
        }
    }, [size, count, itemSize, gap, duration, animation, isVertical])

    function onContainerMouseEnter(e: ReactMouseEvent<HTMLDivElement, MouseEvent>) {
        if (playOnMouseEnter) return
        pausedRef.current = true
        onMouseEnter?.(e)
    }

    function onContainerMouseLeave(e: ReactMouseEvent<HTMLDivElement, MouseEvent>) {
        if (playOnMouseEnter) return
        pausedRef.current = false
        onMouseLeave?.(e)
    }

    const containerStyle2 = css`
        display: flex;
        flex-direction: var(--flex-direction, column);
        gap: var(--gap, 0);

        & > * {
            flex: none;
        }
    `

    return (
        <Scroll ref={ele} scrollbar={bar} onMouseEnter={onContainerMouseEnter} onMouseLeave={onContainerMouseLeave} {...rest}>
            <div
                className={clsx(containerStyle2, containerClassName)}
                style={transformCSSVariable({ gap: px(gap), flexDirection: isVertical ? "column" : "row" }, containerStyle)}
            >
                {children}
            </div>
        </Scroll>
    )
}
