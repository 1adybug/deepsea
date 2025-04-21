import { CSSProperties, ComponentProps, FC, useRef } from "react"
import { clsx, isNonNullable } from "deepsea-tools"
import { useSize } from "soda-hooks"

import styles from "./ScrollMask.module.css"

export type ScrollMaskPosition = "top" | "bottom" | "left" | "right"

export interface ScrollMaskProps extends Omit<ComponentProps<"div">, "children"> {
    position?: ScrollMaskPosition
    size?: number
    from?: CSSProperties["color"]
    to?: CSSProperties["color"]
    contentClassName?: string
    contentStyle?: CSSProperties
    showRadian?: boolean
}

export const ScrollMask: FC<ScrollMaskProps> = ({
    className,
    style,
    position = "top",
    size = 16,
    from = "rgba(0, 0, 0, 0.15)",
    to = "rgba(0, 0, 0, 0)",
    contentClassName,
    contentStyle,
    showRadian = false,
    ...rest
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const contentSize = useSize(ref)
    const radius = isNonNullable(contentSize)
        ? position === "top" || position === "bottom"
            ? (contentSize.width ** 2 / 4 + contentSize.height ** 2) * (contentSize.height * 2)
            : (contentSize.height ** 2 / 4 + contentSize.width ** 2) * (contentSize.width * 2)
        : undefined
    const clipPath =
        showRadian && isNonNullable(radius)
            ? position === "top"
                ? `circle(${radius}px at 50% -${radius - contentSize!.height}px)`
                : position === "bottom"
                  ? `circle(${radius}px at 50% ${radius}px)`
                  : position === "left"
                    ? `circle(${radius}px at -${radius - contentSize!.width} 50%)`
                    : position === "right"
                      ? `circle(${radius}px at ${radius}px 50%)`
                      : "none"
            : "none"

    return (
        <div
            className={clsx(styles["scroll-mask"], styles[`${position}-scroll-mask`], className)}
            style={
                {
                    "--scroll-mask-size": `${size}px`,
                    "--scroll-mask-color-from": from,
                    "--scroll-mask-color-to": to,
                    "--scroll-mask-clip-path": clipPath,
                    ...style,
                } as CSSProperties
            }
            {...rest}
        >
            <div ref={ref} className={clsx(styles["scroll-mask-content"], styles[`${position}-scroll-mask-content`], contentClassName)} style={contentStyle} />
        </div>
    )
}
