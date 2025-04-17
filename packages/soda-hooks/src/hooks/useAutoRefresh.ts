import { useEffect, useRef } from "react"
import { isAbortError } from "deepsea-tools"

export interface AutoRefreshParams {
    interval?: number
    url?: string
}

export function useAutoRefresh(callback: () => void, { interval = 10000, url = "/" }: AutoRefreshParams = {}) {
    const etag = useRef<string | undefined>(undefined)
    const abortController = useRef<AbortController | undefined>(undefined)
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    useEffect(() => {
        let url2: URL
        try {
            url2 = new URL(url)
        } catch (error) {
            try {
                url2 = new URL(url, window.location.origin)
            } catch (error) {
                throw new Error(`Invalid URL: ${url}`)
            }
        }

        const timer = setInterval(async () => {
            try {
                url2.searchParams.set("refresh-timestamp", Date.now().toString())
                abortController.current = new AbortController()
                const response = await fetch(url2, { signal: abortController.current.signal })
                const newEtag = response.headers.get("etag")
                if (newEtag === null || newEtag === etag.current) return
                if (etag.current === undefined) return (etag.current = newEtag)
                etag.current = newEtag
                callbackRef.current()
            } catch (error) {
                if (isAbortError(error)) return
                throw error
            }
        }, interval)

        return () => {
            abortController.current?.abort()
            clearInterval(timer)
        }
    }, [interval, url])
}
