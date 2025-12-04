import { Dispatch, SetStateAction, useRef, useState } from "react"

import { compareArray } from "@/utils/compareArray"

/**
 * 有时候我们需要一个 state，它接收一个外界值作为初始状态，后续变化不受外界值影响，这时候就可以使用 useInputState，当外界值变化时，state 也会变化
 * @param input 外界值或者返回一个状态的函数
 * @param deps 依赖项 deps 变化时，state 会被重置为 input，默认为 [input]，注意如果没有指定依赖项，并且 input 为一个函数时，这个函数每次渲染都会被重新执行，用于比较返回值是否发生变化
 */
export function useInputState<T>(input: T | (() => T), deps?: any[]): [T, Dispatch<SetStateAction<T>>] {
    let newState: T
    let runned = false
    deps ??= [typeof input === "function" ? ((runned = true), (newState = (input as Function)())) : input]
    const prevDeps = useRef(deps)
    const [state, setState] = useState(input)

    if (!compareArray(prevDeps.current, deps)) {
        if (typeof input !== "function") newState = input
        else {
            if (!runned) newState = (input as Function)()
        }

        if (!Object.is(newState!, state)) setState(newState!)
        prevDeps.current = deps
    }

    return [state, setState]
}
