import { useCallback, useMemo, useRef } from "react"
import { Equal } from "soda-type"

import { compareArray } from "@/utils/compareArray"
import { compareSearch } from "@/utils/compareSearch"

export type QueryToStateFnMap = Record<string, ((value: string | null, values: string[]) => any) | undefined>

export type StateToQueryFnMap<T extends QueryToStateFnMap> = {
    [K in keyof T]?: (value: T[K] extends (...args: any[]) => infer R ? R : string | undefined) => string | null | undefined | string[]
}

export type QueryStateOptions<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true> = {
    keys?: T[]
    parse?: K
    stringify?: StateToQueryFnMap<K>
    deps?: any[]
    /** 是否精准匹配，默认开启，如果开启，只能获取和修改 keys 和 parse 中关联的属性，如果关闭，则是所有的属性都可以获取和修改 */
    exact?: P
}

export type QueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true> =
    Equal<K, QueryToStateFnMap> extends true
        ? P extends true
            ? Record<T, string | undefined>
            : Record<string, string | undefined>
        : {
              [Key in T | keyof K]: Key extends keyof K ? (K[Key] extends (...args: any[]) => infer R ? R : string | undefined) : string | undefined
          } & (P extends true ? {} : Record<Exclude<string, T | keyof K>, string>)

export type SetQueryState<T extends string, K extends QueryToStateFnMap, P extends boolean = true> = (
    state:
        | Partial<QueryState<T, K, true> & (P extends true ? {} : Record<Exclude<string, T | keyof K>, any>)>
        | ((prevState: QueryState<T, K, P>) => Partial<QueryState<T, K, true> & (P extends true ? {} : Record<Exclude<string, T | keyof K>, any>)>),
) => void

export type NativeQueryStateOptions<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true> = QueryStateOptions<
    T,
    K,
    P
> & {
    search?: string | URLSearchParams | string[][] | Record<string, string> | undefined
    setSearch?: (next: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void
}

/**
 * 使用原生的 URLSearchParams 实现的 useNativeQueryState
 */
export function useNativeQueryState<T extends string = never, K extends QueryToStateFnMap = QueryToStateFnMap, P extends boolean = true>(
    options?: NativeQueryStateOptions<T, K, P>,
): [QueryState<T, K, P>, SetQueryState<T, K, P>] {
    const { keys = [], parse = {}, stringify = {}, deps = [], search: originalSearch, setSearch: originalSetSearch, exact = true } = options || {}
    const searchParams = originalSearch instanceof URLSearchParams ? originalSearch : new URLSearchParams(originalSearch ?? globalThis.location.search)
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
    const search = (exact ? totalKeys : Array.from(searchParams.keys())).reduce((prev: Record<string, string[]>, key) => {
        prev[key] = searchParams.getAll(key)
        return prev
    }, {})
    console.log(search)
    const cache = useRef({ searchParams, setSearchParams, search, parse, stringify, exact, deps })
    cache.current.searchParams = searchParams
    cache.current.setSearchParams = setSearchParams
    if (!compareSearch(cache.current.search, search) || !compareArray(cache.current.deps, deps)) {
        cache.current = { searchParams, setSearchParams, search, parse, stringify, exact, deps }
    }
    const queryState: QueryState<T, K, P> = useMemo(() => {
        return Object.entries(search).reduce((prev: Record<string, any>, [key, values]) => {
            const value = values[0] ?? undefined
            const parser = (parse as any)[key]
            prev[key] = parser ? parser(value, values) : value
            return prev
        }, {}) as any
    }, [cache.current])
    const queryStateRef = useRef(queryState)
    queryStateRef.current = queryState
    const setQueryState: SetQueryState<T, K, P> = useCallback(state => {
        const newState = typeof state === "function" ? state(queryStateRef.current) : state
        queryStateRef.current = newState as QueryState<T, K, P>
        const { searchParams, setSearchParams, search, stringify } = cache.current
        let newSearchParams: URLSearchParams
        if (exact) {
            newSearchParams = new URLSearchParams(searchParams)
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
                        value.forEach((item: any) => newSearchParams.append(key, String(item)))
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
        } else {
            newSearchParams = new URLSearchParams()
            Object.entries(newState).forEach(([key, value]) => {
                const stringifier = (stringify as any)[key]
                if (!stringifier) {
                    if (value === undefined || value === null) {
                        return
                    }
                    if (Array.isArray(value)) {
                        value.forEach(item => newSearchParams.append(key, String(item)))
                        return
                    }
                    newSearchParams.set(key, String(value))
                    return
                }
                const newValue = stringifier(value)
                if (newValue === undefined || newValue === null) {
                    return
                }
                if (Array.isArray(newValue)) {
                    newValue.forEach(item => newSearchParams.append(key, String(item)))
                    return
                }
                newSearchParams.set(key, String(newValue))
            })
        }
        setSearchParams(newSearchParams)
    }, [])
    return [queryState, setQueryState]
}
