import { useMemo } from "react"

import { BrowserCheckTree } from "./useBrowserGate"
import { useBrowserSafe } from "./useBrowserSafe"

export function useBrowserGateSafe(checkTree: BrowserCheckTree): boolean | null | undefined {
    const browser = useBrowserSafe()
    const match = useMemo(() => (browser ? browser.satisfies(checkTree) : null), [browser, checkTree])

    return match
}
