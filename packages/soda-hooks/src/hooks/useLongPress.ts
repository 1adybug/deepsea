import { useEffect, useRef } from "react"

export interface UseLongPressOptions<T extends HTMLElement = HTMLElement> {
    /** 长按时间阈值 */
    threshold?: number
    /** 长按开始时触发 */
    onStart?: (element: T) => void
    /** 长按结束时触发 */
    onEnd?: (element: T) => void
    /** 长按取消时触发 */
    onCancel?: (element: T) => void
    /** 是否阻止默认行为 */
    preventDefault?: boolean
}

/**
 * 长按事件
 * @param onLongPress 长按事件
 * @param options 配置
 * @returns 
 */
export function useLongPress<T extends HTMLElement = HTMLElement>(
    onLongPress: (element: T) => void,
    { threshold = 400, onStart, onEnd, onCancel, preventDefault = false }: UseLongPressOptions<T> = {},
) {
    const ref = useRef<T>(null)
    const callbacksRef = useRef({ onLongPress, onStart, onEnd, onCancel })
    callbacksRef.current = { onLongPress, onStart, onEnd, onCancel }

    useEffect(() => {
        const element = ref.current
        if (!element) return
        const abortController = new AbortController()
        let timeout: NodeJS.Timeout

        // 按下按钮时开始计时
        element.addEventListener(
            "mousedown",
            () => {
                timeout = setTimeout(() => {
                    callbacksRef.current.onLongPress(element)
                    if (preventDefault) element.addEventListener("click", e => e.preventDefault(), { once: true })
                }, threshold)
                callbacksRef.current.onStart?.(element)
            },
            { signal: abortController.signal },
        )

        // 松开按钮时结束计时
        element.addEventListener(
            "mouseup",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onEnd?.(element)
            },
            { signal: abortController.signal },
        )

        // 鼠标离开按钮时取消计时
        element.addEventListener(
            "mouseleave",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onCancel?.(element)
            },
            { signal: abortController.signal },
        )

        // 触摸开始时开始计时
        element.addEventListener(
            "touchstart",
            e => {
                e.preventDefault()
                timeout = setTimeout(() => {
                    callbacksRef.current.onLongPress(element)
                    if (preventDefault) element.addEventListener("click", e => e.preventDefault(), { once: true })
                }, threshold)
                callbacksRef.current.onStart?.(element)
            },
            { signal: abortController.signal },
        )

        // 触摸结束时结束计时
        element.addEventListener(
            "touchend",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onEnd?.(element)
            },
            { signal: abortController.signal },
        )

        // 触摸取消时取消计时
        element.addEventListener(
            "touchcancel",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onCancel?.(element)
            },
            { signal: abortController.signal },
        )

        return () => {
            abortController.abort()
            clearTimeout(timeout)
        }
    }, [ref.current, threshold, preventDefault])

    return ref
}
