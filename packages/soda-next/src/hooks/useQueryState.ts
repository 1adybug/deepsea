import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { QueryState, QueryStateOptions, QueryToStateFnMap, SetQueryState, useNativeQueryState } from "soda-hooks"

/**
 * 使用 Next 的 useSearchParams 实现的 useQueryState
 */
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap>(
    options?: QueryStateOptions<T, K>,
): [QueryState<T, K>, SetQueryState<T, K>] {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    function setSearchParams(next: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) {
        const newSearchParams = typeof next === "function" ? next(searchParams) : next
        const newSearch = newSearchParams.toString()
        if (newSearchParams.size === 0) return router.push(pathname)
        router.push(`${pathname}?${newSearch}`)
    }
    return useNativeQueryState({ ...options, search: searchParams, setSearch: setSearchParams })
}
