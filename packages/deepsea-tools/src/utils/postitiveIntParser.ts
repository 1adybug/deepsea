import { intParser } from "./intParser"

export function postitiveIntParser(value: string | null | undefined) {
    const num = intParser(value)
    return num && num > 0 ? num : undefined
}
