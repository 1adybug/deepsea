import { useState } from "react"

import { ElementInput, useDomEffect } from "./useDomEffect"

export interface Size {
    width: number
    height: number
}

export interface UseSizeOptions {
    /**
     * 尺寸类型，默认为 border
     */
    type?: "border" | "content"
    /**
     * 方向，默认为 horizontal
     */
    direction?: "horizontal" | "vertical"
    /**
     * 是否缓存尺寸，当元素变化时，尺寸应该先变为 undefined，再变为新的尺寸，开启后会跳过变 undefined 的过程，保持最后一次的尺寸，默认为 false
     */
    cache?: boolean
}

/**
 * 获取元素尺寸
 * @param element 元素，可以是元素本身、元素的 ref、元素的 id 或选择器，也可以是函数，返回值可以是上述类型，推荐使用函数
 * @param options 选项
 * @returns 尺寸
 */
export function useSize<T extends Element>(element: ElementInput<T>, { type = "border", direction = "horizontal", cache = false }: UseSizeOptions = {}) {
    const [size, setSize] = useState<Size | undefined>(undefined)

    useDomEffect(
        target => {
            if (!cache) setSize(undefined)
            if (!target) return

            const observer = new ResizeObserver(entries => {
                const entry = entries[0]
                setSize(
                    type === "border"
                        ? direction === "horizontal"
                            ? { width: entry.borderBoxSize[0].inlineSize, height: entry.borderBoxSize[0].blockSize }
                            : { width: entry.borderBoxSize[0].blockSize, height: entry.borderBoxSize[0].inlineSize }
                        : direction === "horizontal"
                          ? { width: entry.contentBoxSize[0].inlineSize, height: entry.contentBoxSize[0].blockSize }
                          : { width: entry.contentBoxSize[0].blockSize, height: entry.contentBoxSize[0].inlineSize },
                )
            })

            observer.observe(target)
            return () => observer.disconnect()
        },
        [element],
        [type, direction, cache],
    )

    return size
}
