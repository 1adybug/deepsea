import { act, render, renderHook } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import { Navigate } from "../src/components/Navigate"

import { useQueryState } from "../src/hooks/useQueryState"

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }))
vi.mock("next/navigation", () => ({ useRouter: () => router, usePathname: () => "/items", useSearchParams: () => new URLSearchParams("page=2&other=yes") }))

it("parses Next query state and forwards replace and scroll options", () => {
    const { result } = renderHook(() => useQueryState({ parse: { page: value => Number(value ?? 1) }, replace: true }))
    expect(result.current[0].page).toBe(2)
    act(() => result.current[1]({ page: 3 }))
    expect(router.replace).toHaveBeenCalledWith("/items?page=3&other=yes", { scroll: false })
})

it("navigates with push or replace and renders no visible content", () => {
    const view = render(<Navigate to="/target" />)
    expect(router.push).toHaveBeenCalledWith("/target")
    expect(view.container.childElementCount).toBe(0)
    view.rerender(<Navigate to="/replacement" replace />)
    expect(router.replace).toHaveBeenCalledWith("/replacement")
})
