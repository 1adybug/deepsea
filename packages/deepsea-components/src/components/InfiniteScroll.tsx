import { css } from "@emotion/css"
import { useSize } from "ahooks"
import { clsx } from "deepsea-tools"
import { ComponentProps, CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef } from "react"

export type InfiniteScrollProps = ComponentProps<"div"> & {
    /**
     * 滚动的方向
     * @default "vertical"
     */
    direction?: "vertical" | "horizontal"
    /** 渲染 children 的容器的类名 */
    containerClassName?: string
    /** 渲染 children 的容器的样式 */
    containerStyle?: CSSProperties
    /**
     * 两个 children 容器之间的间距
     * @default 0
     */
    gap?: number
    /** 一个周期的时间，单位：毫秒 */
    duration: number
    /** 是否将 gap 的距离也加入 overflow 的计算 */
    withGap?: boolean
    /** 尺寸刚好相同时，是否视为溢出 */
    withEqual?: boolean
}

/**
 * 无限滚动的组件
 * 子元素会内置的容器中被渲染两次，首尾相连，形成无限滚动的效果
 * 但是，如果内部检测到并没有溢出，那么不会渲染两次，并且没有动画
 */
export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>((props, ref) => {
    const { className, direction = "vertical", children, containerClassName, containerStyle, gap = 0, duration, withGap, withEqual, ...rest } = props

    const wrapper = useRef<HTMLDivElement>(null)
    const wrapperSize = useSize(wrapper)

    const ele = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => wrapper.current as HTMLDivElement, [wrapper.current])

    const container = useRef<HTMLDivElement>(null)
    const containerSize = useSize(container)

    function bigger(containerSize: number, wrapperSize: number) {
        return withEqual ? containerSize + (withGap ? gap : 0) >= wrapperSize : containerSize + (withGap ? gap : 0) > wrapperSize
    }

    const overflow = wrapperSize && containerSize ? (direction === "vertical" ? bigger(containerSize.height, wrapperSize.height) : bigger(containerSize.width, wrapperSize.width)) : false

    useEffect(() => {
        if (!wrapperSize || !containerSize || !overflow) return
        const animation = ele.current?.animate(
            {
                transform: direction === "vertical" ? [`translateY(0)`, `translateY(-${containerSize.height + gap}px)`] : [`translateX(0)`, `translateX(-${containerSize.width + gap}px)`]
            },
            { duration, iterations: Infinity }
        )
        return () => animation?.cancel()
    }, [wrapperSize, containerSize, overflow, direction, duration])

    return (
        <div
            ref={wrapper}
            className={clsx(
                css`
                    position: relative;
                    overflow: hidden;
                `,
                className
            )}
            {...rest}>
            <div
                ref={ele}
                style={{
                    position: "absolute",
                    width: direction === "vertical" ? "100%" : containerSize && (overflow ? containerSize.width * 2 + gap : containerSize.width),
                    height: direction === "horizontal" ? "100%" : containerSize && (overflow ? containerSize.height * 2 + gap : containerSize.width)
                }}>
                <div
                    ref={container}
                    className={clsx(
                        css`
                            position: absolute;
                            left: 0;
                            top: 0;
                            ${direction === "vertical" ? "width: 100%;" : "height: 100%;"}
                        `,
                        containerClassName
                    )}
                    style={containerStyle}>
                    {children}
                </div>
                {overflow && (
                    <div
                        ref={container}
                        className={clsx(
                            css`
                                position: absolute;
                                right: 0;
                                bottom: 0;
                                ${direction === "vertical" ? "width: 100%;" : "height: 100%;"}
                            `,
                            containerClassName
                        )}
                        style={containerStyle}>
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
})
