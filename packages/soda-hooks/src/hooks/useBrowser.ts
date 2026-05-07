import { useMemo } from "react"

import { getParser, Parser } from "bowser"

export type BrowserParser = Parser.Parser

export function useBrowser(): BrowserParser {
    const browser = useMemo(() => getParser(window.navigator.userAgent), [])
    return browser
}
