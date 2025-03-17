import { RefObject, useRef } from "react"

/**
 * 用于计算初始值的 ref，不会重复计算
 * @param fn 计算初始值的函数
 * @returns ref
 */
export function useCalcRef<T>(fn: () => T): RefObject<T> {
    const done = useRef(false)
    const ref = useRef<T | undefined>(undefined)
    if (!done.current) {
        done.current = true
        ref.current = fn()
    }
    return ref as RefObject<T>
}
