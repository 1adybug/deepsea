"use client"

import { CSSProperties, ComponentProps, FC, useEffect, useImperativeHandle, useRef, useState } from "react"
import { css } from "@emotion/css"
import { clsx } from "deepsea-tools"

export interface LoopSwiperClassNames {
    root?: string
    container?: string
    mirror?: string
}

export interface LoopSwiperProps extends ComponentProps<"div"> {
    classNames?: LoopSwiperClassNames
    direction?: "horizontal" | "vertical"
    reverse?: boolean
    period: number
    gap?: number
}

/** 循环播放组件 */
export const LoopSwiper: FC<LoopSwiperProps> = ({
    ref,
    className,
    classNames: { root: rootClassName, container: containerClassName, mirror: mirrorClassName } = {},
    children,
    direction,
    period,
    reverse,
    gap = 0,
    ...rest
}) => {
    const wrapper = useRef<HTMLDivElement>(null)
    const container = useRef<HTMLDivElement>(null)
    const [swiper, setSwiper] = useState(false)
    const directionRef = useRef(direction)
    directionRef.current = direction
    const flexDirection: CSSProperties["flexDirection"] = direction === "vertical" ? (reverse ? "column-reverse" : "column") : reverse ? "row-reverse" : "row"
    const animationName = swiper
        ? direction === "vertical"
            ? reverse
                ? "deepsea-reverse-vertical-loop-swipe"
                : "deepsea-vertical-loop-swipe"
            : reverse
              ? "deepsea-reverse-horizontal-loop-swipe"
              : "deepsea-horizontal-loop-swipe"
        : "none"
    const animationDuration = `${period}ms`
    const animationTimingFunction = "linear"
    const animationIterationCount = "infinite"

    useImperativeHandle(ref, () => wrapper.current!, [])

    useEffect(() => {
        const wrapperEle = wrapper.current!
        const containerEle = container.current!
        let wrapperWidth = 0
        let wrapperHeight = 0
        let containerWidth = 0
        let containerHeight = 0
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if (entry.target === wrapperEle) {
                    wrapperWidth = entry.contentRect.width
                    wrapperHeight = entry.contentRect.height
                } else if (entry.target === containerEle) {
                    containerWidth = entry.contentRect.width
                    containerHeight = entry.contentRect.height
                }
            })
            setSwiper(directionRef.current === "vertical" ? containerHeight > wrapperHeight : containerWidth > wrapperWidth)
        })
        observer.observe(wrapperEle)
        observer.observe(containerEle)
    }, [])

    return (
        <div
            ref={wrapper}
            className={clsx(
                css`
                    display: flex;
                    flex-direction: ${flexDirection};
                    gap: ${gap}px;
                    ${direction === "vertical" ? "overflow-y: hidden;" : "overflow-x: hidden;"}

                    @keyframes deepsea-horizontal-loop-swipe {
                        from {
                            transform: translateX(0);
                        }
                        to {
                            transform: translateX(-100%);
                        }
                    }

                    @keyframes deepsea-reverse-horizontal-loop-swipe {
                        from {
                            transform: translateX(0);
                        }
                        to {
                            transform: translateX(100%);
                        }
                    }

                    @keyframes deepsea-vertical-loop-swipe {
                        from {
                            transform: translateY(0);
                        }
                        to {
                            transform: translateY(-100%);
                        }
                    }

                    @keyframes deepsea-reverse-vertical-loop-swipe {
                        from {
                            transform: translateY(0);
                        }
                        to {
                            transform: translateY(100%);
                        }
                    }
                `,
                className,
                rootClassName,
            )}
            {...rest}
        >
            <div
                ref={container}
                className={clsx(
                    css`
                        display: flex;
                        flex-direction: ${flexDirection};
                        gap: ${gap}px;
                        animation-name: ${animationName};
                        animation-timing-function: ${animationTimingFunction};
                        animation-duration: ${animationDuration};
                        animation-iteration-count: ${animationIterationCount};
                    `,
                    containerClassName,
                )}
            >
                {children}
            </div>
            <div
                className={clsx(
                    css`
                        display: ${swiper ? "flex" : "none"};
                        flex-direction: ${flexDirection};
                        gap: ${gap}px;
                        animation-name: ${animationName};
                        animation-timing-function: ${animationTimingFunction};
                        animation-duration: ${animationDuration};
                        animation-iteration-count: ${animationIterationCount};
                    `,
                    mirrorClassName,
                )}
            >
                {children}
            </div>
        </div>
    )
}
