import { Dispatch, SetStateAction, useCallback, useRef } from "react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export type SetNextSearchParamsOptions = {
    /** 是否替换页面 */
    replace?: boolean
    /** 是否滚动到页面顶部 */
    scroll?: boolean
}

export function useNextSearchParams(options?: SetNextSearchParamsOptions) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const optionsRef = useRef(options)
    optionsRef.current = options

    const setSearchParams: Dispatch<SetStateAction<URLSearchParams>> = useCallback(function setSearchParams(value: SetStateAction<URLSearchParams>) {
        const newSearchParams = typeof value === "function" ? value(searchParams) : value
        const newSearch = newSearchParams.toString()
        const newPathname = newSearchParams.size === 0 ? pathname : `${pathname}?${newSearch}`
        const { replace, scroll } = optionsRef.current || {}

        if (replace) router.replace(newPathname, { scroll })
        else router.push(newPathname, { scroll })
    }, [])

    return [searchParams, setSearchParams] as const
}
