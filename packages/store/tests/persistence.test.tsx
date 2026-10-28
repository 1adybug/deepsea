import { renderToString } from "react-dom/server"

import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { createPersistentStore, createStore, isPlainObject } from "../src/index"

describe("store contracts", () => {
    it("initializes lazily once and replaces arrays instead of merging indices", () => {
        const init = vi.fn(() => [1, 2, 3])
        const store = createStore(init)
        store.setState([4])
        expect(store.getState()).toEqual([4])
        expect(init).toHaveBeenCalledTimes(1)
    })

    it("uses Object.is for NaN, signed zero and functional no-ops", () => {
        const store = createStore(NaN)
        const listener = vi.fn()
        store.subscribe(listener)
        store.setState(NaN)
        store.setState(prev => prev)
        expect(listener).not.toHaveBeenCalled()
        store.setState(0)
        store.setState(-0)
        expect(listener).toHaveBeenCalledTimes(2)
    })

    it("unsubscribes idempotently and does not rerender unchanged selections", () => {
        const store = createStore({ count: 1, label: "a" })
        const selector = vi.fn(state => state.count)
        const { result, unmount } = renderHook(() => store(selector))
        const first = result.current
        act(() => store.setState({ label: "b" }))
        expect(result.current).toBe(first)
        act(() => store.setState({ count: 2 }))
        expect(result.current[0]).toBe(2)
        expect(result.current[1]).toBe(store.setState)
        unmount()
        const listener = vi.fn()
        const off = store.subscribe(listener)
        off()
        off()
        store.setState({ count: 3 })
        expect(listener).not.toHaveBeenCalled()
    })

    it("renders the selected server snapshot", () => {
        const store = createStore({ count: 1 }, () => ({ count: 9 }))

        function View() {
            const [count] = store(state => state.count)
            return <span>{count}</span>
        }

        expect(renderToString(<View />)).toBe("<span>9</span>")
    })

    it.each([null, [], new Date(), Object.create(null), () => 1, 1])("does not merge non-plain values: %s", value => {
        expect(isPlainObject(value)).toBe(false)
    })
})

describe("persistent storage", () => {
    it("exposes the storage and codecs and removes only its own key", () => {
        const parse = (text: string) => Number(text)
        const stringify = (value: number) => String(value)
        const factory = vi.fn(() => localStorage)
        localStorage.setItem("unrelated", "keep")
        const store = createPersistentStore(3, { name: "custom", storage: factory, parse, stringify })
        expect(factory).toHaveBeenCalledTimes(1)
        expect(store.getStorage()).toBe(localStorage)
        expect(store.getName()).toBe("custom")
        expect(store.getParse()).toBe(parse)
        expect(store.getStringify()).toBe(stringify)
        store.setState(4)
        expect(localStorage.getItem(store.getStorageKey())).toBe("4")
        store.removeStorage()
        expect(localStorage.getItem(store.getStorageKey())).toBeNull()
        expect(localStorage.getItem("unrelated")).toBe("keep")
    })

    it("recovers from malformed stored JSON and persists the initial state", () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {})
        localStorage.setItem("react-soda-corrupt", "{bad")
        const store = createPersistentStore({ ready: true }, "corrupt")
        expect(store.getState()).toEqual({ ready: true })
        expect(JSON.parse(localStorage.getItem(store.getStorageKey())!)).toEqual({ ready: true })
        expect(error).toHaveBeenCalledTimes(1)
    })

    it.each([false, true])("handles async hydration without overwriting a local update (%s)", async changed => {
        let hydrate!: (value: string | null) => void

        const storage = {
            getItem: () =>
                new Promise<string | null>(resolve => {
                    hydrate = resolve
                }),
            setItem: vi.fn(),
            removeItem: vi.fn(),
        }

        const store = createPersistentStore(0, { name: "async", storage })
        if (changed) store.setState(2)
        hydrate("7")
        await Promise.resolve()
        expect(store.getState()).toBe(changed ? 2 : 7)
        expect(storage.setItem).toHaveBeenLastCalledWith("react-soda-async", changed ? "2" : "7")
    })

    it("retains the initial state when async storage rejects", async () => {
        const failure = new Error("storage unavailable")
        const error = vi.spyOn(console, "error").mockImplementation(() => {})

        const store = createPersistentStore(4, {
            name: "offline",
            storage: { getItem: () => Promise.reject(failure), setItem: vi.fn(), removeItem: vi.fn() },
        })

        await Promise.resolve()
        await Promise.resolve()
        expect(store.getState()).toBe(4)
        expect(error).toHaveBeenCalledWith(failure)
    })
})
