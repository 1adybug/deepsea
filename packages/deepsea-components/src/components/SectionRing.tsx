"use client"

import { HTMLAttributes, forwardRef } from "react"
import { DrawArcOptions, drawArc } from "deepsea-tools"

export interface SectionRingProps extends HTMLAttributes<HTMLDivElement> {
    outerRadius: number
    innerRadius: number
    count: number
    angel: number
}

export const SectionRing = forwardRef<HTMLDivElement, SectionRingProps>((props, ref) => {
    const { outerRadius: o, innerRadius: i, count: c, angel: a, style, ...rest } = props

    const s = (Math.PI * 2) / c - a

    function arc(radius: number, startAngle: number, endAngle: number, options: DrawArcOptions = {}) {
        return drawArc(o, o, radius, startAngle, endAngle, options)
    }

    return (
        <div
            ref={ref}
            style={{
                width: o * 2,
                height: o * 2,
                clipPath: `path("${Array(c)
                    .fill(0)
                    .map(
                        (it, idx) =>
                            `${arc(o, idx * (a + s), idx * (a + s) + a)} ${arc(i, idx * (a + s) + a, idx * (a + s), { line: true, anticlockwise: true })}`,
                    )
                    .join(" ")} Z")`,
                ...style,
            }}
            {...rest}
        />
    )
})
