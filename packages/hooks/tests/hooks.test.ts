import { act, renderHook } from "@testing-library/react"
import { expect, it } from "vitest"

import { useNativeQueryState } from "../src/hooks/useNativeQueryState"
import { createUseStorageState } from "../src/hooks/useStorageState"

it("synchronizes two storage subscribers and removes values through functional updates", () => {
    const useState = createUseStorageState(localStorage)
    const first = renderHook(() => useState("counter"))
    const second = renderHook(() => useState("counter"))
    act(() => first.result.current[1]("1"))
    expect(second.result.current[0]).toBe("1")
    act(() => second.result.current[1](previous => String(Number(previous) + 1)))
    expect(first.result.current[0]).toBe("2")
    act(() => first.result.current[1](null))
    expect(second.result.current[0]).toBe(null)
})

it("parses query state and keeps unrelated URL parameters during updates", () => {
    let search = new URLSearchParams("page=2&unknown=keep")

    const { result, rerender } = renderHook(() =>
        useNativeQueryState({
            parse: { page: value => Number(value ?? 1) },
            search,
            setSearch: next => {
                search = typeof next === "function" ? next(search) : next
            },
        }),
    )

    expect(result.current[0].page).toBe(2)
    act(() => result.current[1](state => ({ page: state.page + 1 })))
    rerender()
    expect(result.current[0].page).toBe(3)
    expect(search.get("unknown")).toBe("keep")
})
