import { QueryState, QueryStateOptions, QueryToStateFnMap, SetQueryState, useNativeQueryState } from "soda-hooks"

import { SetNextSearchParamsOptions, useNextSearchParams } from "./useNextSearchParams"

/**
 * 使用 Next 的 useSearchParams 实现的 useQueryState
 */
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap>(
    options?: QueryStateOptions<T, K> & SetNextSearchParamsOptions,
): [QueryState<T, K>, SetQueryState<T, K>] {
    const { replace, scroll = false, ...rest } = options ?? {}
    const [searchParams, setSearchParams] = useNextSearchParams({ replace, scroll })
    return useNativeQueryState({ ...rest, search: searchParams, setSearch: setSearchParams })
}
