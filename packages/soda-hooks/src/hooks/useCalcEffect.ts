import { RefObject, useEffect, useState } from "react"

import { compareArray } from "@/utils/compareArray"

type GetValue<T> = T extends () => any ? ReturnType<T> : T extends RefObject<infer U> ? U : never

function getValue<T extends (() => any) | RefObject<any>>(value: T): GetValue<T> {
    if (typeof value === "function") return value()
    return value.current
}

type GetValues<T extends any[]> = T extends [infer First, ...infer Rest] ? [GetValue<First>, ...GetValues<Rest>] : []

export function useCalcEffect<T extends [(() => any) | RefObject<any>, ...((() => any) | RefObject<any>)[]]>(
    effect: (...values: GetValues<T>) => void | ((...values: GetValues<T>) => void),
    values: T,
    deps: any[] = [],
) {
    const [value, setValue] = useState(null as unknown as GetValues<T>)

    useEffect(() => {
        const newValue = values.map(getValue) as GetValues<T>
        if (!!value && compareArray(value, newValue)) return
        setValue(newValue)
    })

    useEffect(() => {
        if (!value) return
        const unmount = effect(...value)
        if (typeof unmount !== "function") return
        return () => unmount(...value)
    }, [value, ...deps])
}
