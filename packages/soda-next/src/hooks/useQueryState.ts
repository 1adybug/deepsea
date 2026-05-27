import { type QueryState, type QueryStateOptions, type QueryToStateFnMap, type SetQueryState, useNativeQueryState } from "soda-hooks"

import { type SetNextSearchParamsOptions, useNextSearchParams } from "./useNextSearchParams"

/**
 * 使用 Next 的 useSearchParams 实现的 useQueryState
 */
export function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true>(
    options?: QueryStateOptions<T, K, P> & SetNextSearchParamsOptions,
): [QueryState<T, K, P>, SetQueryState<T, K, P>] {
    const { replace, scroll = false, ...rest } = options ?? {}
    const [searchParams, setSearchParams] = useNextSearchParams({ replace, scroll })
    return useNativeQueryState({ ...rest, search: searchParams, setSearch: setSearchParams })
}
