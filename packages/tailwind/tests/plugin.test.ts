import postcss from "postcss"
import tailwindcss from "tailwindcss"
import { expect, it } from "vitest"

import { soda } from "../src/index"

it("generates utilities through the Tailwind 3 plugin API", async () => {
    const result = await postcss([
        tailwindcss({
            content: [{ raw: '<div class="fill-x fill-y justify-text bg-full"></div>' }],
            plugins: [soda()],
            corePlugins: { preflight: false },
        }),
    ]).process("@tailwind utilities;", { from: undefined })
    expect(result.css).toContain(".fill-x")
    expect(result.css).toContain("min-width: 0")
    expect(result.css).toContain("min-height: 0")
    expect(result.css).toContain("text-align-last: justify")
    expect(result.css).toContain("background-size: 100% 100%")
})
