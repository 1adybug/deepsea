import { z } from "zod"
import { $ZodError } from "zod/v4/core"

export function flattenZodError(error: $ZodError) {
    return Array.from(new Set(z.prettifyError(error).replace(/^✖ /, "").split("\n✖ ")))
}
