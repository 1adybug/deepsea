export interface ActivePath {
    pathname: string
    hash: string
    search: string
}

export function isActiveHref(standard: string | ActivePath, current: string | ActivePath) {
    if (typeof standard === "string") {
        try {
            standard = new URL(standard)
        } catch (error) {
            standard = new URL(standard as string, location.origin)
        }
    }

    if (typeof current === "string") {
        try {
            current = new URL(current)
        } catch (error) {
            current = new URL(current as string, location.origin)
        }
    }

    const standardOrigin = (standard as URL).origin ?? location.origin
    const currentOrigin = (current as URL).origin ?? location.origin
    if (standardOrigin !== currentOrigin) return false
    if (standard.pathname !== current.pathname) return false
    if (standard.hash !== current.hash) return false
    const standardSearch = new URLSearchParams(standard.search)
    const currentSearch = new URLSearchParams(current.search)
    return Array.from(standardSearch.keys()).every(key => {
        const values = standardSearch.getAll(key)
        return values.every(value => currentSearch.getAll(key).includes(value))
    })
}
