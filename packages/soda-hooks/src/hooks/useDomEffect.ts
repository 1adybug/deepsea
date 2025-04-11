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

export function useDomEffect<T extends Element = Element>(
    effect: (eles: (T | null | undefined)[]) => void | ((eles: (T | null | undefined)[]) => void),
    eles: ElementInput<T>[],
    deps: any[] = [],
) {
    const [value, setValue] = useState<(T | null | undefined)[]>([])

    useEffect(() => {
        const newValue = eles.map(dom => getElement(dom))
        if (compareArray(value, newValue)) return
        setValue(newValue)
    })

    useEffect(() => {
        const unmount = effect(value)
        if (typeof unmount !== "function") return
        return () => unmount(value)
    }, [value, ...deps])
}
