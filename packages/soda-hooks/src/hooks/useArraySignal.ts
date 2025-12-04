import { useRef } from "react"

/**
 * 在 react 中比较数组是否发生变化
 */
export function useArraySignal<T>(data: T[], compareFn?: (a: T, b: T) => boolean) {
    const dataRef = useRef(data)
    const signal = useRef(Symbol("arraySignal"))

    if (
        data !== dataRef.current &&
        (dataRef.current.length !== data.length ||
            dataRef.current.some((item, index) => (compareFn ? !compareFn(item, data[index]) : !Object.is(item, data[index]))))
    ) {
        signal.current = Symbol("arraySignal")
        dataRef.current = data
    }

    return signal.current
}
