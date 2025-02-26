import { SetStateAction } from "react"
import { useSearchParams } from "react-router"
import { QueryState, QueryStateOptions, QueryToStateFnMap, SetQueryState, useNativeQueryState } from "soda-hooks"

export type SetQueryStateOptions = {
    /** 是否替换页面 */
    replace?: boolean
    /** 是否滚动到页面顶部 */
    scroll?: boolean
}

/**
 * 使用 React Router 的 useSearchParams 实现的 useQueryState
 */
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true>(
    options?: QueryStateOptions<T, K, P> & SetQueryStateOptions,
): [QueryState<T, K, P>, SetQueryState<T, K, P>] {
    const { replace, scroll = false, ...rest } = options ?? {}
    const [searchParams, setSearchParams] = useSearchParams()
    function setSearch(action: SetStateAction<URLSearchParams>) {
        setSearchParams(action, {
            replace,
            preventScrollReset: !scroll,
        })
    }
    return useNativeQueryState({ ...rest, search: searchParams, setSearch })
}
