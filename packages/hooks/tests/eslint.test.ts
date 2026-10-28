import { expect, it } from "vitest"

import config, { additionalEffectHooks, reactHooksSettings } from "../src/eslint"

it("shares the exact custom effect-hook matcher through both ESLint integration forms", () => {
    const pattern = new RegExp(additionalEffectHooks)
    expect(pattern.test("useStableEffect")).toBe(true)
    expect(pattern.test("useStableEffectOther")).toBe(false)
    expect(config[0].settings).toBe(reactHooksSettings)
    expect(reactHooksSettings["react-hooks"].additionalEffectHooks).toBe(additionalEffectHooks)
})
