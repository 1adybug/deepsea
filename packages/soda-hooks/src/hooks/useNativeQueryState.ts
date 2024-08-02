import { useCallback, useMemo, useRef } from "react"
import { Equal } from "soda-type"
import { compareArray } from "@utils/compareArray"
import { compareSearch } from "@utils/compareSearch"

export type QueryToStateFnMap = Record<string, ((value: string | null, values: string[]) => any) | undefined>

export type StateToQueryFnMap<T extends QueryToStateFnMap> = {
    [K in keyof T]?: (value: T[K] extends (...args: any[]) => infer R ? R : string | undefined) => string | null | undefined | string[]
}

export type QueryStateOptions<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap> = {
    keys?: T[]
    parse?: K
    stringify?: StateToQueryFnMap<K>
    deps?: any[]
}

export type QueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap> =
    Equal<K, QueryToStateFnMap> extends true
        ? Record<T, string | undefined>
        : {
              [Key in T | keyof K]: Key extends keyof K ? (K[Key] extends (...args: any[]) => infer R ? R : string | undefined) : string | undefined
          }

export type SetQueryState<T extends string, K extends QueryToStateFnMap> = (state: Partial<QueryState<T, K>> | ((prevState: QueryState<T, K>) => Partial<QueryState<T, K>>)) => void

export type NativeQueryStateOptions<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap> = QueryStateOptions<T, K> & {
    search?: URLSearchParams
    setSearch?: (next: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void
}

/**
 * 使用原生的 URLSearchParams 实现的 useNativeQueryState
 */
export function useNativeQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap>(options?: NativeQueryStateOptions<T, K>): [QueryState<T, K>, SetQueryState<T, K>] {
    const { keys = [], parse = {}, stringify = {}, deps = [], search: originalSearch, setSearch: originalSetSearch } = options || {}
    const searchParams = originalSearch ?? new URLSearchParams(window.location.search)
    const setSearchParams =
        originalSetSearch ??
        function setSearchParams(next: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) {
            const newSearchParams = typeof next === "function" ? next(searchParams) : next
            const newSearch = newSearchParams.toString()
            const url = new URL(window.location.href)
            url.search = newSearch
            window.history.replaceState(null, "", url.toString())
        }
    const totalKeys = (keys as string[]).concat(Object.keys(parse))
    const search = totalKeys.reduce((prev: Record<string, string[]>, key) => {
        prev[key] = searchParams.getAll(key)
        return prev
    }, {})
    const cache = useRef({ searchParams, setSearchParams, search, parse, stringify, deps })
    cache.current.searchParams = searchParams
    cache.current.setSearchParams = setSearchParams
    if (!compareSearch(cache.current.search, search) || !compareArray(cache.current.deps, deps)) {
        cache.current = { searchParams, setSearchParams, search, parse, stringify, deps }
    }
    const queryState: QueryState<T, K> = useMemo(() => {
        return Object.entries(search).reduce((prev: Record<string, any>, [key, values]) => {
            const value = values[0] ?? undefined
            const parser = (parse as any)[key]
            prev[key] = parser ? parser(value, values) : value
            return prev
        }, {}) as any
    }, [cache.current])
    const queryStateRef = useRef(queryState)
    queryStateRef.current = queryState
    const setQueryState: SetQueryState<T, K> = useCallback(state => {
        const newState = typeof state === "function" ? state(queryStateRef.current) : state
        const { searchParams, setSearchParams, search, parse, stringify } = cache.current
        const newSearchParams = new URLSearchParams(searchParams)
        Object.keys(search).forEach(key => {
            const value = newState[key as keyof typeof newState]
            const stringifier = (stringify as any)[key]
            if (!stringifier) {
                if (value === undefined || value === null) {
                    newSearchParams.delete(key)
                    return
                }
                if (Array.isArray(value)) {
                    newSearchParams.delete(key)
                    value.forEach(item => newSearchParams.append(key, String(item)))
                    return
                }
                newSearchParams.set(key, String(value))
                return
            }
            const newValue = stringifier(value)
            if (newValue === undefined || newValue === null) {
                newSearchParams.delete(key)
                return
            }
            if (Array.isArray(newValue)) {
                newSearchParams.delete(key)
                newValue.forEach(item => newSearchParams.append(key, String(item)))
                return
            }
            newSearchParams.set(key, String(newValue))
        })
        setSearchParams(newSearchParams)
    }, [])
    return [queryState, setQueryState]
}
