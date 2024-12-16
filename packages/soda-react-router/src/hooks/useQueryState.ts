import { SetStateAction } from "react"
import { useSearchParams } from "react-router-dom"
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
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap>(
    options?: QueryStateOptions<T, K> & SetQueryStateOptions,
): [QueryState<T, K>, SetQueryState<T, K>] {
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
