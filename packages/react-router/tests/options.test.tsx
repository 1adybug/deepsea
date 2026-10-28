import type { PropsWithChildren } from "react"

import { act, renderHook } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { expect, it, vi } from "vitest"

import { createUseQueryState, useQueryState } from "../src/hooks/useQueryState"

it("passes navigation options to an injected router adapter", () => {
    const setter = vi.fn()
    const useQuery = createUseQueryState(() => [new URLSearchParams("page=1"), setter])
    const { result } = renderHook(() => useQuery({ keys: ["page"], replace: true, scroll: true }))
    act(() => result.current[1]({ page: "2" }))
    expect(setter).toHaveBeenCalledWith(expect.any(URLSearchParams), { replace: true, preventScrollReset: false })
})

it("supports parsed arrays, deletion and replacement mode in a real MemoryRouter", () => {
    function Router({ children }: PropsWithChildren) {
        return <MemoryRouter initialEntries={["/items?tag=a&tag=b&keep=yes"]}>{children}</MemoryRouter>
    }

    const { result } = renderHook(
        () => ({
            state: useQueryState({ parse: { tag: (_first, all) => all }, stringify: { tag: values => values }, replace: true }),
            location: useLocation(),
        }),
        { wrapper: Router },
    )

    expect(result.current.state[0].tag).toEqual(["a", "b"])
    act(() => result.current.state[1]({ tag: [] }))
    expect(result.current.location.search).toBe("?keep=yes")
})
