import { type RefObject, useEffect, useState } from "react"

import { compareArray } from "@/utils/compareArray"

type GetValue<T> = T extends () => any ? ReturnType<T> : T extends RefObject<infer U> ? U : never

function getValue<T extends (() => any) | RefObject<any>>(value: T): GetValue<T> {
    if (typeof value === "function") return value()
    return value.current
}

type GetValues<T extends any[]> = T extends [infer First, ...infer Rest] ? [GetValue<First>, ...GetValues<Rest>] : []

type CalcEffect<T extends any[]> = (...values: T) => void | ((...values: T) => void)

interface Snapshot<T extends any[]> {
    values: T
    deps: any[]
    effect: CalcEffect<T>
}

/**
 * 在每次渲染提交后重新计算 values，并在计算结果或额外依赖 deps 变化时执行 effect。
 *
 * 计算结果使用 Object.is 逐项比较。values 中的函数应返回原始值或引用稳定的对象；
 * 如果每次计算都返回新的对象、数组等引用，Hook 会认为结果持续变化并继续触发更新。
 */
export function useCalcEffect<T extends [(() => any) | RefObject<any>, ...((() => any) | RefObject<any>)[]]>(
    effect: CalcEffect<GetValues<T>>,
    values: T,
    deps: any[] = [],
) {
    const [snapshot, setSnapshot] = useState<Snapshot<GetValues<T>>>()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const newValues = values.map(getValue) as GetValues<T>
        if (snapshot && compareArray(snapshot.values, newValues) && compareArray(snapshot.deps, deps)) return

        setSnapshot({ values: newValues, deps: [...deps], effect })
    })

    useEffect(() => {
        if (!snapshot) return
        const unmount = snapshot.effect(...snapshot.values)
        if (typeof unmount !== "function") return

        return () => unmount(...snapshot.values)
    }, [snapshot])
}
