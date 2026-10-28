import { render } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import App from "../src/App"

it("renders the playground with the actual workspace component library", () => {
    const disconnect = vi.fn()

    vi.stubGlobal(
        "ResizeObserver",
        class {
            observe() {}

            disconnect = disconnect
        },
    )

    const { container, unmount } = render(<App />)
    expect(container.querySelector(".overflow-y-auto")).not.toBeNull()
    expect(container.querySelector(".bg-red-500")).not.toBeNull()
    unmount()
    expect(container.childElementCount).toBe(0)
    expect(disconnect).toHaveBeenCalledTimes(2)
    vi.unstubAllGlobals()
})
