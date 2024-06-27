import { intReg } from "@constants/index"

export function intParser(value: string | null | undefined) {
    if (!value) return undefined
    value = value.trim()
    if (!intReg.test(value)) return undefined
    return parseInt(value)
}
