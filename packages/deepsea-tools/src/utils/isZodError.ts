import { $ZodError } from "zod/v4/core"

export function isZodError(error: unknown): error is $ZodError {
    return error instanceof Error && "issues" in error && (error.constructor.name === "ZodError" || error.constructor.name === "$ZodError")
}
