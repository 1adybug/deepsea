import { act, renderHook } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import { useNextSearchParams } from "../src/hooks/useNextSearchParams"

const navigation = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }))

vi.mock("next/navigation", () => ({
    useRouter: () => navigation,
    usePathname: () => "/items",
    useSearchParams: () => new URLSearchParams("page=1"),
}))

it("pushes encoded search parameters and switches to replace with the latest options", () => {
    const { result, rerender } = renderHook(({ replace }) => useNextSearchParams({ replace, scroll: false }), { initialProps: { replace: false } })
    act(() => result.current[1](new URLSearchParams({ query: "格数" })))
    expect(navigation.push).toHaveBeenCalledWith("/items?query=%E6%A0%BC%E6%95%B0", { scroll: false })
    rerender({ replace: true })
    act(() => result.current[1](new URLSearchParams()))
    expect(navigation.replace).toHaveBeenCalledWith("/items", { scroll: false })
})
