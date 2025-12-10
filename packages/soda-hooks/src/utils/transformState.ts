import { SetStateAction, useCallback, useMemo, useRef } from "react"

type UseState<T, P extends (...args: any[]) => any> = [T, P]

export interface TransformStateParams<T, P extends (...args: any[]) => any, X> {
    /** 获取状态 */
    get(state: T): X
    /** 设置状态 */
    set(state: X): Parameters<P>[0]
    /**
     * 是否依赖 get 函数
     * @default true
     */
    dependOnGet?: boolean
}

/**
 * 这个函数的作用是在获取状态之前使用 get 函数对状态进行转换，在设置状态之前使用 set 函数对状态先转化为原始的状态
 */
export function transformState<T, P extends (...args: any[]) => any, X>(
    [state, setState]: UseState<T, P>,
    { get, set, dependOnGet = true }: TransformStateParams<T, P, X>,
) {
    const newState = useMemo(() => get(state), dependOnGet ? [state, get] : [state])
    const cache = useRef({ newState, setState, set })
    cache.current.newState = newState
    cache.current.setState = setState
    cache.current.set = set

    const newSetState = useCallback(function setState(state: SetStateAction<X>) {
        const { newState, setState, set } = cache.current
        const next = typeof state === "function" ? (state as (prev: X) => X)(newState) : state
        cache.current.newState = next
        setState(set(next))
    }, [])

    return [newState, newSetState, state, setState] as const
}
