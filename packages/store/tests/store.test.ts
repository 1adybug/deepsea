import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { createPersistentStore, createStore } from "../src/index"

describe("store state transitions", () => {
    it("continues reading and writing the existing react-soda persistence key", () => {
        localStorage.setItem("react-soda-migration", JSON.stringify({ count: 7 }))
        const store = createPersistentStore({ count: 0 }, "migration")
        expect(store.getStorageKey()).toBe("react-soda-migration")
        expect(store.getState()).toEqual({ count: 7 })
        store.setState({ count: 8 })
        expect(JSON.parse(localStorage.getItem("react-soda-migration")!)).toEqual({ count: 8 })
    })

    it("merges object updates, supports replacement and reports previous state", () => {
        const store = createStore({ count: 0, name: "initial" })
        const listener = vi.fn()
        const unsubscribe = store.subscribe(listener)
        store.setState(state => ({ count: state.count + 1 }))
        expect(store.getState()).toEqual({ count: 1, name: "initial" })
        expect(listener).toHaveBeenCalledWith({ count: 1, name: "initial" }, { count: 0, name: "initial" })
        store.setState({ count: 2, name: "replaced" }, true)
        expect(store.getState(state => state.count)).toBe(2)
        unsubscribe()
        store.setState({ count: 3 })
        expect(listener).toHaveBeenCalledTimes(2)
    })

    it("notifies mounted hooks and skips identical primitive state", () => {
        const store = createStore(0)
        const listener = vi.fn()
        store.subscribe(listener)
        const { result } = renderHook(() => store())
        act(() => store.setState(value => value + 1))
        expect(result.current[0]).toBe(1)
        act(() => store.setState(1))
        expect(listener).toHaveBeenCalledTimes(1)
    })
})
