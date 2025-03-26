import { isNonNullable } from "deepsea-tools"
import { RefObject, useEffect, useRef, useState } from "react"

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

export type ElementType<T extends Element> = T | null | undefined | RefObject<T | null | undefined> | string

export type ElementInput<T extends Element> = ElementType<T> | (() => ElementType<T>)

export function getElement<T extends Element>(element: ElementInput<T>) {
    if (typeof element === "function") return getElement(element())
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

interface Cache<T extends Element> extends UseSizeOptions<T> {
    target?: T
    observer?: ResizeObserver
}

/**
 * 获取元素尺寸
 * @param element 元素，可以是元素本身、元素的 ref、元素的 id 或选择器，也可以是函数，返回值可以是上述类型，推荐使用函数
 * @param options 选项
 * @returns 尺寸
 */
export function useSize<T extends Element>(element: ElementInput<T>, { type = "border", direction = "horizontal" }: UseSizeOptions<T> = {}) {
    const [size, setSize] = useState<Size | undefined>(undefined)
    const { current: cache } = useRef<Cache<T>>({})

    useEffect(() => {
        const target = getElement(element)
        if (cache.target === target && cache.type === type && cache.direction === direction && !!cache.observer) return
        cache.observer?.disconnect()
        if (!target) return
        cache.target = target
        cache.type = type
        cache.direction = direction
        cache.observer = new ResizeObserver(entries => {
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
        cache.observer?.observe(target)
    })

    useEffect(
        () => () => {
            cache.observer?.disconnect()
            cache.observer = undefined
        },
        [],
    )

    return size
}
