import { intParser } from "./intParser"
import { isNullable } from "./isNullable"

export function dateParser(value?: string | null | undefined) {
    const num = intParser(value)
    if (isNullable(num)) return undefined
    return new Date(num)
}
