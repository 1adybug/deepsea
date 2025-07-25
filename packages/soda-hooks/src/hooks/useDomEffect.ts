import { isNonNullable } from "deepsea-tools"
import { RefObject } from "react"

import { useCalcEffect } from "./useCalcEffect"

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

export type GetElement<T> = T extends ElementInput<infer U> ? U | null | undefined : never

export type GetElements<T extends any[]> = T extends [infer First, ...infer Rest] ? [GetElement<First>, ...GetElements<Rest>] : []

export function useDomEffect<T extends [ElementInput<Element>, ...ElementInput<Element>[]]>(
    effect: (...eles: GetElements<T>) => void | ((...eles: GetElements<T>) => void),
    eles: T,
    deps: any[] = [],
) {
    useCalcEffect(effect as any, eles.map(item => () => getElement(item)) as any, deps)
}
