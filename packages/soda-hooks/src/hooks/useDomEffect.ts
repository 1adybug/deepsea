import { RefObject, useEffect, useState } from "react"
import { isNonNullable } from "deepsea-tools"

import { compareArray } from "@/utils/compareArray"

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

export type GetElements<T extends ElementInput<Element>[]> = T extends [infer First, ...infer Rest]
    ? [GetElement<First>, ...(Rest extends ElementInput<Element>[] ? GetElements<Rest> : [])]
    : []

export function useDomEffect<T extends [ElementInput<Element>, ...ElementInput<Element>[]]>(
    effect: (...eles: GetElements<T>) => void | ((...eles: GetElements<T>) => void),
    eles: T,
    deps: any[] = [],
) {
    const [value, setValue] = useState(eles.map(() => null) as GetElements<T>)

    useEffect(() => {
        const newValue = eles.map(dom => getElement(dom))
        if (compareArray(value, newValue)) return
        setValue(newValue as GetElements<T>)
    })

    useEffect(() => {
        const unmount = effect(...value)
        if (typeof unmount !== "function") return
        return () => unmount(...value)
    }, [value, ...deps])
}
