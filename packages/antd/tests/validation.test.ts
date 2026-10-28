import { expect, it } from "vitest"
import { z } from "zod"

import { aclsm } from "../src/utils/aclsm"
import { getTimeRange } from "../src/utils/getTimeRange"
import { schemaToRule } from "../src/utils/schemaToRule"

it("maps Zod validation success and errors into Ant Design rules", async () => {
    const rule = schemaToRule(z.string().min(2, "too short"))
    if (typeof rule !== "object" || !("validator" in rule) || !rule.validator) throw new Error("Expected a validator rule")
    await expect(rule.validator({}, "valid", () => {})).resolves.toBeUndefined()
    await expect(rule.validator({}, "", () => {})).rejects.toBe("too short")
})

it("merges dynamic class slots and normalizes date ranges", () => {
    const classes = aclsm<"root", boolean>({ root: "p-2 text-red-500" }, active => ({ root: active ? "p-4" : undefined }))
    expect(classes(true).root).toBe("text-red-500 p-4")
    expect(getTimeRange(null, 1)).toBeUndefined()
    const range = getTimeRange(new Date(2026, 9, 28, 12).valueOf(), new Date(2026, 9, 29, 12).valueOf())!
    expect(range[0].hour()).toBe(0)
    expect(range[1].hour()).toBe(23)
    expect(range[1].millisecond()).toBe(999)
})
