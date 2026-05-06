import { useEffect, useState } from "react"

import { getParser, Parser } from "bowser"

import { BrowserParser } from "./useBrowser"

/**
 * useBrowser 的 ssr 版本
 */
export function useBrowserSafe(): BrowserParser | null {
    const [browser, setBrowser] = useState<Parser.Parser | null>(null)

    // eslint-disable-next-line
    useEffect(() => setBrowser(getParser(window.navigator.userAgent)), [])

    return browser
}
