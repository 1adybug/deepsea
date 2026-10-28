import { useState } from "react"

import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useArraySignal } from "../src/hooks/useArraySignal"
import { useCalcRef } from "../src/hooks/useCalcRef"
import { useInputState } from "../src/hooks/useInputState"
import { useLatest } from "../src/hooks/useLatest"
import { useNativeQueryState } from "../src/hooks/useNativeQueryState"
import { useSearchTree } from "../src/hooks/useSearchTree"
import { useStableEffect } from "../src/hooks/useStableEffect"
import { createUseStorageState } from "../src/hooks/useStorageState"

import { transformState } from "../src/utils/transformState"

describe("state identity", () => {
    it("keeps latest refs and calculates a ref only once including undefined results", () => {
        const init = vi.fn(() => undefined)
        const { result, rerender } = renderHook(({ value }) => ({ latest: useLatest(value), calc: useCalcRef(init) }), { initialProps: { value: 1 } })
        const refs = result.current
        rerender({ value: 2 })
        expect(result.current.latest).toBe(refs.latest)
        expect(result.current.latest.current).toBe(2)
        expect(result.current.calc).toBe(refs.calc)
        expect(init).toHaveBeenCalledTimes(1)
    })

    it("changes array signals only for different values", () => {
        const { result, rerender } = renderHook(({ values }) => useArraySignal(values), { initialProps: { values: [1, NaN] } })
        const initial = result.current
        rerender({ values: [1, NaN] })
        expect(result.current).toBe(initial)
        rerender({ values: [2, NaN] })
        expect(result.current).not.toBe(initial)
    })

    it("supports custom array equality", () => {
        const { result, rerender } = renderHook(({ values }) => useArraySignal(values, (a, b) => a.id === b.id), { initialProps: { values: [{ id: 1 }] } })
        const first = result.current
        rerender({ values: [{ id: 1 }] })
        expect(result.current).toBe(first)
        rerender({ values: [] })
        expect(result.current).not.toBe(first)
    })

    it("preserves local input edits until dependencies change", () => {
        const { result, rerender } = renderHook(({ input, id }) => useInputState(() => input, [id]), { initialProps: { input: 1, id: "a" } })
        act(() => result.current[1](9))
        rerender({ input: 2, id: "a" })
        expect(result.current[0]).toBe(9)
        rerender({ input: 2, id: "b" })
        expect(result.current[0]).toBe(2)
    })

    it("transforms consecutive functional updates against the latest pending value", () => {
        const { result } = renderHook(() => transformState(useState("1"), { get: (value: string) => Number(value), set: (value: number) => String(value) }))
        const setter = result.current[1]

        act(() => {
            setter(n => n + 1)
            setter(n => n + 1)
        })

        expect(result.current[0]).toBe(3)
        expect(result.current[2]).toBe("3")
        expect(result.current[1]).toBe(setter)
    })

    it("uses structural dependencies and cleans up stable effects", () => {
        const cleanup = vi.fn()
        const effect = vi.fn(() => cleanup)
        const { rerender, unmount } = renderHook(({ data }) => useStableEffect(effect, [data]), { initialProps: { data: { id: 1 } } })
        rerender({ data: { id: 1 } })
        expect(effect).toHaveBeenCalledTimes(1)
        rerender({ data: { id: 2 } })
        expect(cleanup).toHaveBeenCalledTimes(1)
        unmount()
        expect(cleanup).toHaveBeenCalledTimes(2)
    })
})

describe("storage and search", () => {
    it("switches keys and ignores events from a different storage area", () => {
        const useStorage = createUseStorageState(localStorage)
        localStorage.setItem("a", "one")
        localStorage.setItem("b", "two")
        const { result, rerender, unmount } = renderHook(({ key }) => useStorage(key), { initialProps: { key: "a" } })
        rerender({ key: "b" })
        expect(result.current[0]).toBe("two")
        act(() => window.dispatchEvent(new StorageEvent("storage", { key: "b", storageArea: sessionStorage, newValue: "bad" })))
        expect(result.current[0]).toBe("two")
        act(() => useStorage.storage.clear())
        expect(result.current[0]).toBeNull()
        unmount()
    })

    it("parses repeated parameters and serializes arrays while retaining unrelated keys", () => {
        let search = new URLSearchParams("tag=a&tag=b&keep=yes")

        const { result, rerender } = renderHook(() =>
            useNativeQueryState({
                search,
                parse: { tag: (_first, values) => values },
                stringify: { tag: values => values },
                setSearch: next => {
                    search = typeof next === "function" ? next(search) : next
                },
            }),
        )

        expect(result.current[0]).toEqual({ tag: ["a", "b"] })
        act(() => result.current[1]({ tag: ["x", "y"] }))
        rerender()
        expect(search.getAll("tag")).toEqual(["x", "y"])
        expect(search.get("keep")).toBe("yes")
        act(() => result.current[1]({ tag: [] }))
        expect(search.has("tag")).toBe(false)
    })

    it("uses the current exact option after switching query modes", () => {
        const setSearch = vi.fn()
        const { result, rerender } = renderHook(
            ({ exact }) => useNativeQueryState({ search: "page=1&keep=yes", keys: ["page"], exact, deps: [exact], setSearch }),
            { initialProps: { exact: true } },
        )
        rerender({ exact: false })
        act(() => result.current[1]({ custom: "value" } as never))
        expect(setSearch.mock.lastCall?.[0].toString()).toBe("custom=value")
    })

    it("replaces native browser search without removing the hash", () => {
        history.replaceState(null, "", "/items?page=1#details")
        const { result } = renderHook(() => useNativeQueryState({ keys: ["page"] }))
        act(() => result.current[1]({ page: "2" }))
        expect(location.pathname + location.search + location.hash).toBe("/items?page=2#details")
        history.replaceState(null, "", "/")
    })
})

describe("tree search", () => {
    it("keeps ancestors of matches and all descendants of matching branches", () => {
        const tree = [{ id: "root", children: [{ id: "match", children: [{ id: "child" }] }, { id: "hidden" }] }]

        const { result } = renderHook(() => useSearchTree(tree, item => item.id === "match"))
        expect(result.current?.searchTree).toEqual([{ id: "root", children: [{ id: "match", children: [{ id: "child" }] }] }])
        expect(result.current?.trueFibers.size).toBe(1)
        expect(tree[0].children).toHaveLength(2)
    })

    it("returns null for an empty source and an empty result for no matches", () => {
        expect(renderHook(() => useSearchTree([], () => true)).result.current).toBeNull()
        expect(renderHook(() => useSearchTree([{ id: 1 }], () => false)).result.current?.searchTree).toEqual([])
    })
})
