import { useMemo } from "react"

import { Parser } from "bowser"

import { useBrowser } from "./useBrowser"

export type BrowserCheckTree = Parser.checkTree

export function useBrowserGate(checkTree: BrowserCheckTree): boolean | undefined {
    const browser = useBrowser()
    const match = useMemo(() => browser.satisfies(checkTree), [browser, checkTree])
    return match
}
