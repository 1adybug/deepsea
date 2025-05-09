import { SetStateAction } from "react"
import { useSearchParams as _useSearchParams } from "react-router"
import { QueryState, QueryStateOptions, QueryToStateFnMap, SetQueryState, useNativeQueryState } from "soda-hooks"

export type SetQueryStateOptions = {
    /** 是否替换页面 */
    replace?: boolean
    /** 是否滚动到页面顶部 */
    scroll?: boolean
}

/**
 * 由于 react-router 和 react 一样，不能存在多个版本，你可以使用 createUseQueryState 传入你使用的 react-router[-dom] 的 useSearchParams 钩子，创建一个 useQueryState 的钩子
 */
export function createUseQueryState(useSearchParams = _useSearchParams) {
    /**
     * 使用 React Router 的 useSearchParams 实现的 useQueryState
     */
    return function useQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true>(
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
}

export const useQueryState = createUseQueryState()
