export function isActiveHref(standard: string, current: string) {
    let standardUrl: URL
    try {
        standardUrl = new URL(standard)
    } catch (error) {
        standardUrl = new URL(standard, location.origin)
    }
    let currentUrl: URL
    try {
        currentUrl = new URL(current)
    } catch (error) {
        currentUrl = new URL(current, location.origin)
    }
    if (standardUrl.origin !== currentUrl.origin) return false
    if (standardUrl.pathname !== currentUrl.pathname) return false
    if (standardUrl.hash !== currentUrl.hash) return false
    const standardSearch = new URLSearchParams(standardUrl.search)
    const currentSearch = new URLSearchParams(currentUrl.search)
    return Array.from(standardSearch.keys()).every(key => {
        const values = standardSearch.getAll(key)
        return values.every(value => currentSearch.getAll(key).includes(value))
    })
}
