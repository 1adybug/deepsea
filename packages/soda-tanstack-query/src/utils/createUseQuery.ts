import {
    DefinedInitialDataOptions,
    DefinedUseQueryResult,
    QueryClient,
    UndefinedInitialDataOptions,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query"

/** 判断函数的参数是否为必需的 */
export type IsParamRequired<TFn extends (params: any) => any> = Parameters<TFn> extends [param: any] ? true : false

// 要在第一个加一个重载，因为 options 是可选的，如果不加这个重载，类型会任务是 DefinedInitialDataOptions，造成返回类型必定不为 undefined

/** 参数必须的 useQuery */
interface _UseQueryWithParams<TFn extends (params: any) => any, TParams = Parameters<TFn>[0], TResponse = Awaited<ReturnType<TFn>>> {
    <TData = TResponse>(params: TParams): UseQueryResult<NoInfer<TData>, Error>
    <TData = TResponse>(
        params: TParams,
        options?: Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
    <TData = TResponse>(
        params: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
    <TData = TResponse>(
        params: TParams,
        options?: Omit<UseQueryOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryWithParams<TFn extends (params: any) => any> extends _UseQueryWithParams<TFn> {}

/** 参数可选的 useQuery */
interface _UseQueryWithOptionalParams<TFn extends (params?: any) => any, TParams = Parameters<TFn>[0], TResponse = Awaited<ReturnType<TFn>>> {
    <TData = TResponse>(params?: TParams): UseQueryResult<NoInfer<TData>, Error>
    <TData = TResponse>(
        params?: TParams,
        options?: Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
    <TData = TResponse>(
        params?: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
    <TData = TResponse>(
        params?: TParams,
        options?: Omit<UseQueryOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryWithOptionalParams<TFn extends (params?: any) => any> extends _UseQueryWithOptionalParams<TFn> {}

/** 根据参数是否必需，选择不同的 useQuery */
export type UseQuery<TFn extends (param: any) => any> = IsParamRequired<TFn> extends true ? UseQueryWithParams<TFn> : UseQueryWithOptionalParams<TFn>

/** 传递了初始化参数的 createUseQuery 参数 */
export interface _CreateUseQueryDefinedInitialDataParams<
    TFn extends (param: any) => any,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> extends Omit<DefinedInitialDataOptions<TResponse, Error, TResponse, [string, TParams]>, "queryKey" | "queryFn" | "select"> {
    queryFn: TFn
    queryKey: string
}

export interface CreateUseQueryDefinedInitialDataParams<TFn extends (param: any) => any> extends _CreateUseQueryDefinedInitialDataParams<TFn> {}

/** 传递了初始化参数的参数必需的 useQuery */
interface _UseQueryDefinedInitialDataWithParams<TFn extends (params: any) => any, TParams = Parameters<TFn>[0], TResponse = Awaited<ReturnType<TFn>>> {
    <TData = TResponse>(
        params: TParams,
        options?: Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryDefinedInitialDataWithParams<TFn extends (params: any) => any> extends _UseQueryDefinedInitialDataWithParams<TFn> {}

/** 传递了初始化参数的参数可选的 useQuery */
interface _UseQueryDefinedInitialDataWithOptionalParams<TFn extends (params?: any) => any, TParams = Parameters<TFn>[0], TResponse = Awaited<ReturnType<TFn>>> {
    <TData = TResponse>(
        params?: TParams,
        options?: Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryDefinedInitialDataWithOptionalParams<TFn extends (params?: any) => any> extends _UseQueryDefinedInitialDataWithOptionalParams<TFn> {}

/** 根据参数是否必需，选择不同的 useQuery */
export type UseQueryDefinedInitialData<TFn extends (params?: any) => any> =
    IsParamRequired<TFn> extends true ? UseQueryDefinedInitialDataWithParams<TFn> : UseQueryDefinedInitialDataWithOptionalParams<TFn>

/** 未传递初始化参数的 createUseQuery 参数 */
export interface _CreateUseQueryUndefinedInitialDataParams<
    TFn extends (param: any) => any,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> extends Omit<UndefinedInitialDataOptions<TResponse, Error, TResponse, [string, TParams]>, "queryKey" | "queryFn" | "select"> {
    queryFn: TFn
    queryKey: string
}

export interface CreateUseQueryUndefinedInitialDataParams<TFn extends (param: any) => any> extends _CreateUseQueryUndefinedInitialDataParams<TFn> {}

/** 未传递初始化参数的参数必需的 useQuery */
interface _UseQueryUndefinedInitialDataWithParams<TFn extends (params: any) => any, TParams = Parameters<TFn>[0], TResponse = Awaited<ReturnType<TFn>>> {
    <TData = TResponse>(
        params: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryUndefinedInitialDataWithParams<TFn extends (params: any) => any> extends _UseQueryUndefinedInitialDataWithParams<TFn> {}

/** 未传递初始化参数的参数可选的 useQuery */
interface _UseQueryUndefinedInitialDataWithOptionalParams<
    TFn extends (params: any) => any,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TResponse>(
        params?: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryUndefinedInitialDataWithOptionalParams<
    TFn extends (params?: any) => any,
> extends _UseQueryUndefinedInitialDataWithOptionalParams<TFn> {}

/** 根据参数是否必需，选择不同的 useQuery */
export type UseQueryUndefinedInitialData<TFn extends (params?: any) => any> =
    IsParamRequired<TFn> extends true ? UseQueryUndefinedInitialDataWithParams<TFn> : UseQueryUndefinedInitialDataWithOptionalParams<TFn>

export interface _CreateUseQueryParams<TFn extends (param: any) => any, TParams = Parameters<TFn>[0], TResponse = Awaited<ReturnType<TFn>>> extends Omit<
    UseQueryOptions<TResponse, Error, TResponse, [string, TParams]>,
    "queryKey" | "queryFn" | "select"
> {
    queryFn: TFn
    queryKey: string
}

export interface CreateUseQueryParams<TFn extends (param: any) => any> extends _CreateUseQueryParams<TFn> {}

// 根据是否传递初始化参数，选择不同的 createUseQuery，目前存在一个问题，UndefinedInitialDataOptions 和 UseQueryOptions 是完全一致的，所以匹配不到第三种可能，但这是 @tanstack/react-query 的问题
export function createUseQuery<TFn extends (param: any) => any>(params: CreateUseQueryDefinedInitialDataParams<TFn>): UseQueryDefinedInitialData<TFn>
export function createUseQuery<TFn extends (param: any) => any>(pararm: CreateUseQueryUndefinedInitialDataParams<TFn>): UseQueryUndefinedInitialData<TFn>
export function createUseQuery<TFn extends (param: any) => any>(pararm: CreateUseQueryParams<TFn>): UseQuery<TFn>
export function createUseQuery<TFn extends (param: any) => any>({ queryFn, queryKey, ...rest }: CreateUseQueryParams<TFn>): UseQuery<TFn> {
    return function useRequest(params: any, options?: any, client?: QueryClient) {
        return useQuery(
            {
                queryKey: [queryKey, params],
                queryFn: () => queryFn(params),
                ...rest,
                ...options,
            },
            client,
        )
    }
}
