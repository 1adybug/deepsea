import { postitiveIntParser } from "./postitiveIntParser"

export function getPostitiveIntParser(defaultValue: number = 1) {
    return function _postitiveIntParser(value: string | null | undefined) {
        return postitiveIntParser(value) ?? defaultValue
    }
}
