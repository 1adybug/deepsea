import type { PropsWithChildren } from "react"

import { act, renderHook } from "@testing-library/react"
import { MemoryRouter, useLocation } from "react-router"
import { expect, it } from "vitest"

import { useQueryState } from "../src/hooks/useQueryState"

function Router({ children }: PropsWithChildren) {
    return <MemoryRouter initialEntries={["/items?page=1&other=keep"]}>{children}</MemoryRouter>
}

it("updates router search state while preserving unrelated query keys", () => {
    const { result } = renderHook(
        () => ({
            query: useQueryState({ keys: ["page"] }),
            location: useLocation(),
        }),
        { wrapper: Router },
    )

    expect(result.current.query[0].page).toBe("1")
    act(() => result.current.query[1]({ page: "2" }))
    expect(result.current.query[0].page).toBe("2")
    expect(new URLSearchParams(result.current.location.search).get("other")).toBe("keep")
})
