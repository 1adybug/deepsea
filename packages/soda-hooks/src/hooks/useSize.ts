import { isNonNullable } from "deepsea-tools"
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

export function getElement<T extends Element>(element: T | null | undefined | RefObject<T | null | undefined> | string) {
    return (
        isNonNullable(element)
            ? typeof element === "string"
                ? document.querySelector(element)
                : element instanceof Element
                  ? element
                  : element.current
            : undefined
    ) as T | undefined | null
}

export function useSize<T extends Element>(
    element: T | null | undefined | RefObject<T | null | undefined> | string,
    { type = "border", direction = "horizontal" }: UseSizeOptions<T> = {},
) {
    const [size, setSize] = useState<Size | undefined>(undefined)
    const target = getElement(element)
    useEffect(() => {
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
    }, [target, type, direction])
    return size
}
