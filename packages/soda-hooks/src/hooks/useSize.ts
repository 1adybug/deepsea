import { RefObject, useEffect, useState } from "react"

export interface Size {
    width: number
    height: number
}

export interface UseSizeOptions<T> {
    /**
     * 尺寸类型，默认为 border
     */
    type?: "border" | "content"
    /**
     * 方向，默认为 horizontal
     */
    direction?: "horizontal" | "vertical"
}

export function useSize<T extends HTMLElement>(
    element: T | null | undefined | RefObject<T | null | undefined> | string,
    { type = "border", direction = "horizontal" }: UseSizeOptions<T> = {},
) {
    const [size, setSize] = useState<Size | undefined>(undefined)
    useEffect(() => {
        if (!element) return
        const target = (typeof element === "string" ? document.querySelector(element) : element instanceof HTMLElement ? element : element.current) as T
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
    }, [element, type, direction])
    return size
}
