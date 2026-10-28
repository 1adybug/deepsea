export function booleanParser(value?: string | null | undefined) {
    value = value?.trim().toLowerCase()
    if (!value) return undefined
    if (value === "true" || value === "1") return true
    if (value === "false" || value === "0") return false
    return undefined
}
