import { useEffect, useRef } from "react"

export interface DragMoveEvent<T extends HTMLElement> {
    /** 目标元素 */
    target: T
    /** 从拖拽开始的总位移 X */
    x: number
    /** 从拖拽开始的总位移 Y */
    y: number
}

export function useDragMove<T extends HTMLElement>(callback: (event: DragMoveEvent<T>) => void) {
    const ref = useRef<T>(null)
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    useEffect(() => {
        const element = ref.current
        if (!element) return

        let startX = 0
        let startY = 0

        function onMouseDown(event: MouseEvent) {
            startX = event.clientX
            startY = event.clientY
            window.addEventListener("mousemove", onMouseMove)
            window.addEventListener("mouseup", onMouseUp)
        }

        function onMouseMove(event: MouseEvent) {
            const x = event.clientX - startX
            const y = event.clientY - startY
            callbackRef.current({ target: element!, x, y })
        }

        function onMouseUp(event: MouseEvent) {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }

        element.addEventListener("mousedown", onMouseDown)

        return () => {
            element.removeEventListener("mousedown", onMouseDown)
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }
    }, [ref.current])

    return ref
}
