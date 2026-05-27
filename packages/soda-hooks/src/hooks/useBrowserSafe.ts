import { useEffect, useState } from "react"

import { type Parser, getParser } from "bowser"

import type { BrowserParser } from "./useBrowser"

/**
 * useBrowser 的 ssr 版本
 */
export function useBrowserSafe(): BrowserParser | null {
    const [browser, setBrowser] = useState<Parser.Parser | null>(null)

    useEffect(() => setBrowser(getParser(window.navigator.userAgent)), [])

    return browser
}
