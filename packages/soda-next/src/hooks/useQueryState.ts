import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SetStateAction } from "react"
import { QueryState, QueryStateOptions, QueryToStateFnMap, SetQueryState, useNativeQueryState } from "soda-hooks"

export type SetQueryStateOptions = {
    /** 是否替换页面 */
    replace?: boolean
    /** 是否滚动到页面顶部 */
    scroll?: boolean
}

/**
 * 使用 Next 的 useSearchParams 实现的 useQueryState
 */
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap>(
    options?: QueryStateOptions<T, K> & SetQueryStateOptions,
): [QueryState<T, K>, SetQueryState<T, K>] {
    const { replace, scroll = false, ...rest } = options ?? {}
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    function setSearchParams(action: SetStateAction<URLSearchParams>) {
        const newSearchParams = typeof action === "function" ? action(searchParams) : action
        const newSearch = newSearchParams.toString()
        const newPathname = newSearchParams.size === 0 ? pathname : `${pathname}?${newSearch}`
        if (replace) router.replace(newPathname, { scroll })
        else router.push(newPathname, { scroll })
    }
    return useNativeQueryState({ ...rest, search: searchParams, setSearch: setSearchParams })
}
