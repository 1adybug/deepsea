import { useEffect, useRef } from "react"

export interface UseLongPressOptions {
    threshold?: number
    onStart?: () => void
    onEnd?: () => void
    onCancel?: () => void
}

export function useLongPress<T extends HTMLElement = HTMLElement>(
    onLongPress: () => void,
    { threshold = 400, onStart, onEnd, onCancel }: UseLongPressOptions = {},
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
                timeout = setTimeout(() => callbacksRef.current.onLongPress(), threshold)
                callbacksRef.current.onStart?.()
            },
            { signal: abortController.signal },
        )

        // 松开按钮时结束计时
        element.addEventListener(
            "mouseup",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onEnd?.()
            },
            { signal: abortController.signal },
        )

        // 鼠标离开按钮时取消计时
        element.addEventListener(
            "mouseleave",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onCancel?.()
            },
            { signal: abortController.signal },
        )

        // 触摸开始时开始计时
        element.addEventListener(
            "touchstart",
            e => {
                e.preventDefault()
                timeout = setTimeout(() => callbacksRef.current.onLongPress(), threshold)
                callbacksRef.current.onStart?.()
            },
            { signal: abortController.signal },
        )

        // 触摸结束时结束计时
        element.addEventListener(
            "touchend",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onEnd?.()
            },
            { signal: abortController.signal },
        )

        // 触摸取消时取消计时
        element.addEventListener(
            "touchcancel",
            () => {
                clearTimeout(timeout)
                callbacksRef.current.onCancel?.()
            },
            { signal: abortController.signal },
        )

        return () => {
            abortController.abort()
            clearTimeout(timeout)
        }
    }, [ref.current, onLongPress, threshold])

    return ref
}
