import { useRef } from "react"

import { ElementInput, useDomEffect } from "./useDomEffect"

export interface DragMoveEvent<T extends HTMLElement = HTMLElement> extends MouseEvent {
    /** 目标元素 */
    dragTarget: T
    /** 从拖拽开始的总位移 X */
    deltaX: number
    /** 从拖拽开始的总位移 Y */
    deltaY: number
}

export interface DragMoveEvents<T extends HTMLElement = HTMLElement> {
    onDragMoveStart?(event: DragMoveEvent<T>): void
    onDragMove?(event: DragMoveEvent<T>): void
    onDragMoveEnd?(event: DragMoveEvent<T>): void
}

export interface UseDragMoveParams<T extends HTMLElement = HTMLElement> extends DragMoveEvents<T> {
    element?: ElementInput<T>
}

export function useDragMove<T extends HTMLElement = HTMLElement>({ element, onDragMoveStart, onDragMove, onDragMoveEnd }: UseDragMoveParams<T>) {
    const cache = useRef({ onDragMoveStart, onDragMove, onDragMoveEnd }).current
    cache.onDragMoveStart = onDragMoveStart
    cache.onDragMove = onDragMove
    cache.onDragMoveEnd = onDragMoveEnd

    useDomEffect(
        element => {
            const target = element as T
            if (!target) return

            let startX = 0
            let startY = 0

            function onMouseDown(event: MouseEvent) {
                startX = event.clientX
                startY = event.clientY
                const dragMoveEvent = event as DragMoveEvent<T>
                dragMoveEvent.dragTarget = target
                dragMoveEvent.deltaX = 0
                dragMoveEvent.deltaY = 0
                cache.onDragMoveStart?.(dragMoveEvent)
                window.addEventListener("mousemove", onMouseMove)
                window.addEventListener("mouseup", onMouseUp)
            }

            function onMouseMove(event: MouseEvent) {
                const x = event.clientX - startX
                const y = event.clientY - startY
                const dragMoveEvent = event as DragMoveEvent<T>
                dragMoveEvent.dragTarget = target
                dragMoveEvent.deltaX = x
                dragMoveEvent.deltaY = y
                cache.onDragMove?.(dragMoveEvent)
            }

            function onMouseUp(event: MouseEvent) {
                const dragMoveEvent = event as DragMoveEvent<T>
                dragMoveEvent.dragTarget = target
                dragMoveEvent.deltaX = 0
                dragMoveEvent.deltaY = 0
                cache.onDragMoveEnd?.(dragMoveEvent)
                window.removeEventListener("mousemove", onMouseMove)
                window.removeEventListener("mouseup", onMouseUp)
            }

            target.addEventListener("mousedown", onMouseDown)

            return () => {
                target.removeEventListener("mousedown", onMouseDown)
                window.removeEventListener("mousemove", onMouseMove)
                window.removeEventListener("mouseup", onMouseUp)
            }
        },
        [element],
    )
}
