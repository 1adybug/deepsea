import { useSearchParams } from "react-router-dom"
import { QueryToStateFnMap, QueryStateOptions, QueryState, SetQueryState, useNativeQueryState } from "soda-hooks"

/**
 * 使用 React Router 的 useSearchParams 实现的 useQueryState
 */
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap>(options?: QueryStateOptions<T, K>): [QueryState<T, K>, SetQueryState<T, K>] {
    const [searchParams, setSearchParams] = useSearchParams()
    return useNativeQueryState({ ...options, search: searchParams, setSearch: setSearchParams })
}

export default useQueryState