import { act, fireEvent, render, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useCalcEffect } from "../src/hooks/useCalcEffect"
import { getElement } from "../src/hooks/useDomEffect"
import { useDragMove } from "../src/hooks/useDragMove"
import { useEventListener } from "../src/hooks/useEventListener"
import { useLongPress } from "../src/hooks/useLongPress"
import { useScrollMemo } from "../src/hooks/useScrollMemo"
import { useSize } from "../src/hooks/useSize"
import { useVideoStalled } from "../src/hooks/useVideoStalled"

afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
})

describe("DOM effects", () => {
    it("resolves ids, selectors, refs, callbacks and absent elements", () => {
        const { container } = render(<div id="target" className="target" />)
        const target = container.firstElementChild!
        for (const input of [target, "target", ".target", { current: target }, () => target]) expect(getElement(input)).toBe(target)
        expect(getElement("missing")).toBeNull()
        expect(getElement(null)).toBeUndefined()
    })

    it("cleans up with the values captured by each calculated effect", () => {
        const cleanup = vi.fn()
        const effect = vi.fn(() => cleanup)

        const ref = { current: 1 }

        const { rerender, unmount } = renderHook(() => useCalcEffect(effect, [ref]))
        rerender()
        expect(effect).toHaveBeenCalledTimes(1)
        ref.current = 2
        rerender()
        expect(cleanup).toHaveBeenCalledWith(1)
        expect(effect).toHaveBeenLastCalledWith(2)
        unmount()
        expect(cleanup).toHaveBeenLastCalledWith(2)
    })

    it("binds one listener with the latest callback and removes it on unmount", () => {
        const target = new EventTarget()
        const first = vi.fn()
        const second = vi.fn()
        const { rerender, unmount } = renderHook(({ listener }) => useEventListener(target)("change", listener), { initialProps: { listener: first } })
        target.dispatchEvent(new Event("change"))
        rerender({ listener: second })
        target.dispatchEvent(new Event("change"))
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
        unmount()
        target.dispatchEvent(new Event("change"))
        expect(second).toHaveBeenCalledTimes(1)
    })

    it("reports drag deltas and stops tracking after release or unmount", () => {
        const element = document.createElement("div")
        const onDragMove = vi.fn()
        const onDragMoveEnd = vi.fn()
        const { unmount } = renderHook(() => useDragMove({ element, onDragMove, onDragMoveEnd }))
        fireEvent.mouseDown(element, { clientX: 10, clientY: 20 })
        fireEvent.mouseMove(window, { clientX: 15, clientY: 17 })
        expect(onDragMove.mock.lastCall?.[0]).toMatchObject({ dragTarget: element, deltaX: 5, deltaY: -3 })
        fireEvent.mouseUp(window, { clientX: 20, clientY: 30 })
        expect(onDragMoveEnd.mock.lastCall?.[0]).toMatchObject({ deltaX: 10, deltaY: 10 })
        fireEvent.mouseMove(window)
        expect(onDragMove).toHaveBeenCalledTimes(1)
        unmount()
    })

    it("measures the requested box and disconnects ResizeObserver", () => {
        let callback!: ResizeObserverCallback
        const disconnect = vi.fn()
        const observe = vi.fn()

        vi.stubGlobal(
            "ResizeObserver",
            class {
                constructor(cb: ResizeObserverCallback) {
                    callback = cb
                }

                observe = observe
                disconnect = disconnect
            },
        )

        const target = document.createElement("div")
        const { result, unmount } = renderHook(() => useSize(target, { type: "content", direction: "vertical" }))
        act(() => callback([{ contentBoxSize: [{ inlineSize: 10, blockSize: 20 }] } as never], {} as ResizeObserver))
        expect(result.current).toEqual({ width: 20, height: 10 })
        expect(observe).toHaveBeenCalledWith(target)
        unmount()
        expect(disconnect).toHaveBeenCalled()
    })
})

describe("timers and media", () => {
    it("fires a long press only after the threshold and cancels pending presses", () => {
        vi.useFakeTimers()
        const pressed = vi.fn()

        function View() {
            const ref = useLongPress<HTMLButtonElement>(pressed, { threshold: 100 })
            return <button ref={ref}>hold</button>
        }

        const view = render(<View />)
        const button = view.getByRole("button")
        fireEvent.mouseDown(button)
        act(() => vi.advanceTimersByTime(99))
        expect(pressed).not.toHaveBeenCalled()
        fireEvent.mouseUp(button)
        act(() => vi.advanceTimersByTime(100))
        expect(pressed).not.toHaveBeenCalled()
        fireEvent.mouseDown(button)
        act(() => vi.advanceTimersByTime(100))
        expect(pressed).toHaveBeenCalledWith(button)
        fireEvent.mouseDown(button)
        view.unmount()
        act(() => vi.advanceTimersByTime(100))
        expect(pressed).toHaveBeenCalledTimes(1)
    })

    it("restores scroll, records changes and cancels delayed restoration", () => {
        vi.useFakeTimers()
        sessionStorage.setItem("scroll", JSON.stringify({ left: 3, top: 8 }))
        const element = document.createElement("div")
        element.scrollTo = vi.fn()
        const { unmount } = renderHook(() => useScrollMemo({ target: element, key: "scroll", delay: 100 }))
        act(() => vi.advanceTimersByTime(100))
        expect(element.scrollTo).toHaveBeenCalledWith({ left: 3, top: 8, behavior: undefined })
        element.scrollTop = 22
        fireEvent.scroll(element)
        expect(JSON.parse(sessionStorage.getItem("scroll")!)).toEqual({ left: 0, top: 22 })
        unmount()
        const other = renderHook(() => useScrollMemo({ target: element, key: "scroll", delay: 100 }))
        other.unmount()
        act(() => vi.advanceTimersByTime(100))
        expect(element.scrollTo).toHaveBeenCalledTimes(1)
    })

    it("reports a stall once per progress cycle and removes the watchdog", () => {
        vi.useFakeTimers()
        const video = document.createElement("video")
        Object.defineProperty(video, "paused", { configurable: true, value: false })
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" })
        const onStalled = vi.fn()
        const { unmount } = renderHook(() => useVideoStalled({ video, onStalled, timeout: 100 }))
        act(() => vi.advanceTimersByTime(100))
        expect(onStalled).toHaveBeenCalledTimes(1)
        act(() => vi.advanceTimersByTime(500))
        expect(onStalled).toHaveBeenCalledTimes(1)
        fireEvent.timeUpdate(video)
        act(() => vi.advanceTimersByTime(100))
        expect(onStalled).toHaveBeenCalledTimes(2)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
    })
})
