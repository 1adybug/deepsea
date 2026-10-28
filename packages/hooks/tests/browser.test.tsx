import { act, fireEvent, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { useAsync } from "../src/hooks/useAsync"
import { useAutoPlay } from "../src/hooks/useAutoPlay"
import { useAutoRefresh } from "../src/hooks/useAutoRefresh"
import { useBrowser } from "../src/hooks/useBrowser"
import { useBrowserGate } from "../src/hooks/useBrowserGate"
import { useBrowserGateSafe } from "../src/hooks/useBrowserGateSafe"
import { useBrowserSafe } from "../src/hooks/useBrowserSafe"
import { createUseIsActive } from "../src/hooks/useIsActive"
import { useLocalStorageState } from "../src/hooks/useLocalStorageState"
import { useSessionStorageState } from "../src/hooks/useSessionStorageState"
import { useThirdPartyImageErrorHandler } from "../src/hooks/useThirdPartyImageErrorHandler"
import { useTransitionNum } from "../src/hooks/useTransitionNum"

import { compareArray } from "../src/utils/compareArray"
import { compareSearch } from "../src/utils/compareSearch"

afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
})

describe("browser hooks", () => {
    it("memoizes browser parsing and evaluates both safe and immediate browser gates", () => {
        vi.spyOn(window.navigator, "userAgent", "get").mockReturnValue(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )

        const { result, rerender } = renderHook(() => ({
            browser: useBrowser(),
            safe: useBrowserSafe(),
            gate: useBrowserGate({ chrome: ">=100" }),
            safeGate: useBrowserGateSafe({ chrome: ">=100" }),
        }))

        const parser = result.current.browser
        expect(parser.getBrowserName()).toBe("Chrome")
        expect(result.current.safe?.getBrowserName()).toBe("Chrome")
        expect(result.current.gate).toBe(true)
        expect(result.current.safeGate).toBe(true)
        rerender()
        expect(result.current.browser).toBe(parser)
    })

    it("derives active status from string and structured locations", () => {
        const useActive = createUseIsActive(() => ({ href: "https://app.test/items?q=1&extra=2" }))
        expect(renderHook(() => useActive("https://app.test/items?q=1")).result.current).toBe(true)
        const useStructured = createUseIsActive(() => ({ pathname: "/items", search: "", hash: "" }))
        expect(renderHook(() => useStructured("/other")).result.current).toBe(false)
    })

    it("keeps local and session storage state independent", () => {
        const local = renderHook(() => useLocalStorageState("key"))
        const session = renderHook(() => useSessionStorageState("key"))
        act(() => local.result.current[1]("local"))
        expect(session.result.current[0]).toBeNull()
        act(() => session.result.current[1]("session"))
        expect(local.result.current[0]).toBe("local")
        expect(session.result.current[0]).toBe("session")
    })

    it("marks only failed external images and removes injected styles", () => {
        const before = document.head.querySelectorAll("style").length
        const { unmount } = renderHook(() => useThirdPartyImageErrorHandler({ content: ["Missing", "image"], fontSize: 12 }))

        const external = document.createElement("img"),
            internal = document.createElement("img")

        external.src = "https://external.test/image.png"
        internal.src = "/image.png"
        document.body.append(external, internal)
        fireEvent.error(external)
        fireEvent.error(internal)
        expect(external.dataset).toHaveProperty("thirdPartyImageError")
        expect(internal.dataset).not.toHaveProperty("thirdPartyImageError")
        expect(document.head.querySelectorAll("style").length).toBe(before + 1)
        unmount()
        expect(document.head.querySelectorAll("style").length).toBe(before)
        external.remove()
        internal.remove()
    })
})

describe("asynchronous lifecycle", () => {
    it("runs async generators and invokes cleanup on unmount", async () => {
        const steps: number[] = [],
            cleanup = vi.fn(),
            finalized = vi.fn()

        const effect = async function* () {
            try {
                steps.push(1)
                yield
                steps.push(2)
            } finally {
                finalized()
            }
        }

        const { unmount } = renderHook(() => useAsync(effect, cleanup, []))
        await act(async () => {
            await Promise.resolve()
            await Promise.resolve()
        })
        expect(steps).toEqual([1, 2])
        expect(finalized).toHaveBeenCalledTimes(1)
        unmount()
        expect(cleanup).toHaveBeenCalledTimes(1)
    })

    it("retries blocked autoplay on user interaction and removes retry listeners", async () => {
        const video = document.createElement("video")
        const play = vi.spyOn(video, "play").mockRejectedValueOnce(new Error("blocked")).mockResolvedValue(undefined)
        const { result, unmount } = renderHook(() => useAutoPlay({ current: video }))
        expect(result.current.current).toBe(video)
        await act(async () => {
            await Promise.resolve()
        })
        await act(async () => {
            fireEvent.click(window)
            await Promise.resolve()
        })
        expect(play).toHaveBeenCalledTimes(2)
        fireEvent.click(window)
        expect(play).toHaveBeenCalledTimes(2)
        unmount()
    })

    it("ignores absent and unchanged ETags and reports updates using the latest callback", async () => {
        vi.useFakeTimers()

        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce({ headers: new Headers() })
            .mockResolvedValueOnce({ headers: new Headers({ etag: "v1" }) })
            .mockResolvedValueOnce({ headers: new Headers({ etag: "v1" }) })
            .mockResolvedValue({ headers: new Headers({ etag: "v2" }) })

        vi.stubGlobal("fetch", fetchMock)

        const first = vi.fn(),
            second = vi.fn()

        const { rerender, unmount } = renderHook(({ callback }) => useAutoRefresh(callback, { interval: 100, url: "/app" }), {
            initialProps: { callback: first },
        })

        await act(async () => vi.advanceTimersByTimeAsync(300))
        expect(first).not.toHaveBeenCalled()
        rerender({ callback: second })
        await act(async () => vi.advanceTimersByTimeAsync(100))
        expect(second).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.lastCall?.[0].pathname).toBe("/app")
        expect(fetchMock.mock.lastCall?.[1].signal.aborted).toBe(true)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
    })

    it("animates numeric state to a new target and cancels on unmount", () => {
        vi.useFakeTimers()
        const { result, rerender, unmount } = renderHook(({ target }) => useTransitionNum({ target, speed: 1 }), { initialProps: { target: 1 } })
        rerender({ target: 5 })
        act(() => vi.advanceTimersByTime(100))
        expect(result.current).toBe(5)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
    })
})

it("compares arrays and repeated search values using Object.is", () => {
    expect(compareArray([NaN, -0], [NaN, -0])).toBe(true)
    expect(compareArray([0], [-0])).toBe(false)
    expect(compareSearch({ tag: ["a", "b"] }, { tag: ["a", "b"] })).toBe(true)
    expect(compareSearch({ tag: ["a", "b"] }, { tag: ["b", "a"] })).toBe(false)
})
