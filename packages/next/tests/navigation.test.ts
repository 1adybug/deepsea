import { act, renderHook } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import { useNextSearchParams } from "../src/hooks/useNextSearchParams"

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn(), pathname: "/items", search: "page=1" }))

vi.mock("next/navigation", () => ({
    useRouter: () => navigation,
    usePathname: () => navigation.pathname,
    useSearchParams: () => new URLSearchParams(navigation.search),
}))

it("pushes encoded search parameters and switches to replace with the latest options", () => {
    const { result, rerender } = renderHook(({ replace }) => useNextSearchParams({ replace, scroll: false }), { initialProps: { replace: false } })
    act(() => result.current[1](new URLSearchParams({ query: "测试" })))
    expect(navigation.push).toHaveBeenCalledWith("/items?query=%E6%B5%8B%E8%AF%95", { scroll: false })
    rerender({ replace: true })
    act(() => result.current[1](new URLSearchParams()))
    expect(navigation.replace).toHaveBeenCalledWith("/items", { scroll: false })
})

it("applies functional updates to the latest pathname and search snapshot", () => {
    const { result, rerender } = renderHook(() => useNextSearchParams())
    const setter = result.current[1]
    navigation.pathname = "/other"
    navigation.search = "page=9&keep=yes"
    rerender()

    act(() =>
        setter(previous => {
            const next = new URLSearchParams(previous)
            next.set("page", "10")
            return next
        }),
    )

    expect(navigation.push).toHaveBeenLastCalledWith("/other?page=10&keep=yes", { scroll: undefined })
    expect(result.current[1]).toBe(setter)
    navigation.pathname = "/items"
    navigation.search = "page=1"
})
