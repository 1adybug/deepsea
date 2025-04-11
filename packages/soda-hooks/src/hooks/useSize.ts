import { RefObject, useEffect, useRef, useState } from "react"
import { isNonNullable } from "deepsea-tools"

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
    /**
     * 是否缓存尺寸，当元素变化时，尺寸应该先变为 undefined，再变为新的尺寸，开启后会跳过变 undefined 的过程，保持最后一次的尺寸，默认为 false
     */
    cache?: boolean
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

interface ConfigCache<T extends Element> extends UseSizeOptions<T> {
    target?: T | null | undefined
    observer?: ResizeObserver
}

/**
 * 获取元素尺寸
 * @param element 元素，可以是元素本身、元素的 ref、元素的 id 或选择器，也可以是函数，返回值可以是上述类型，推荐使用函数
 * @param options 选项
 * @returns 尺寸
 */
export function useSize<T extends Element>(element: ElementInput<T>, { type = "border", direction = "horizontal", cache = false }: UseSizeOptions<T> = {}) {
    const [size, setSize] = useState<Size | undefined>(undefined)
    const { current: config } = useRef<ConfigCache<T>>({})

    useEffect(() => {
        const target = getElement(element)
        if (config.target === target && config.type === type && config.direction === direction && config.cache === cache) return
        config.target = target
        config.type = type
        config.direction = direction
        config.cache = cache
        config.observer?.disconnect()
        config.observer = undefined
        if (!cache) setSize(undefined)
        if (!target) return
        config.observer = new ResizeObserver(entries => {
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
        config.observer?.observe(target)
    })

    useEffect(
        () => () => {
            config.observer?.disconnect()
            Object.keys(config).forEach(key => delete config[key as keyof ConfigCache<T>])
        },
        [],
    )

    return size
}
