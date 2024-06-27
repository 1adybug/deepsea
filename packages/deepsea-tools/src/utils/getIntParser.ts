import { intParser } from "./intParser"

export function getIntParser(defaultValue: number = 0) {
    return function _intParser(value: string | null | undefined) {
        return intParser(value) ?? defaultValue
    }
}
