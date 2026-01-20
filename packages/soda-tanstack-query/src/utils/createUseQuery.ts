import {
    DefinedInitialDataOptions,
    DefinedUseQueryResult,
    QueryClient,
    UndefinedInitialDataOptions,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query"
import { StrictPartial } from "soda-type"

/** 判断函数的参数是否为必需的 */
export type IsParamRequired<TFn extends (params: any) => any> = Parameters<TFn> extends [param: any] ? true : false

// 要在第一个加一个重载，因为 options 是可选的，如果不加这个重载，类型会任务是 DefinedInitialDataOptions，造成返回类型必定不为 undefined

/** 参数必须的 useQuery */
interface _UseQueryWithParams<
    TFn extends (params: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TInitSelectData>(params: TParams): UseQueryResult<NoInfer<TData>, Error>
    <TData = TInitSelectData>(
        params: TParams,
        options?: Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
    <TData = TInitSelectData>(
        params: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
    <TData = TInitSelectData>(
        params: TParams,
        options?: Omit<UseQueryOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryWithParams<TFn extends (params: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> extends _UseQueryWithParams<
    TFn,
    TInitSelectData
> {}

/** 参数可选的 useQuery */
interface _UseQueryWithOptionalParams<
    TFn extends (params?: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TInitSelectData>(params?: TParams): UseQueryResult<NoInfer<TData>, Error>
    <TData = TInitSelectData>(
        params?: TParams,
        options?: Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
    <TData = TInitSelectData>(
        params?: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
    <TData = TInitSelectData>(
        params?: TParams,
        options?: Omit<UseQueryOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryWithOptionalParams<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> extends _UseQueryWithOptionalParams<
    TFn,
    TInitSelectData
> {}

/** 根据参数是否必需，选择不同的 useQuery */
export type UseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> =
    IsParamRequired<TFn> extends true ? UseQueryWithParams<TFn, TInitSelectData> : UseQueryWithOptionalParams<TFn, TInitSelectData>

/** 传递了初始化参数的 createUseQuery 参数 */
export interface _CreateUseQueryDefinedInitialDataParams<
    TFn extends (param: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> extends Omit<DefinedInitialDataOptions<TResponse, Error, TInitSelectData, [string, TParams]>, "queryKey" | "queryFn"> {
    queryFn: TFn
    queryKey: string
}

export interface CreateUseQueryDefinedInitialDataParams<
    TFn extends (param: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
> extends _CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData> {}

/** 传递了初始化参数的参数必需的 useQuery */
interface _UseQueryDefinedInitialDataWithParams<
    TFn extends (params: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TInitSelectData>(
        params: TParams,
        options?: StrictPartial<Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">, "initialData">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryDefinedInitialDataWithParams<
    TFn extends (params: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
> extends _UseQueryDefinedInitialDataWithParams<TFn, TInitSelectData> {}

/** 传递了初始化参数的参数可选的 useQuery */
interface _UseQueryDefinedInitialDataWithOptionalParams<
    TFn extends (params?: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TInitSelectData>(
        params?: TParams,
        options?: StrictPartial<Omit<DefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">, "initialData">,
        client?: QueryClient,
    ): DefinedUseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryDefinedInitialDataWithOptionalParams<
    TFn extends (params?: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
> extends _UseQueryDefinedInitialDataWithOptionalParams<TFn, TInitSelectData> {}

/** 根据参数是否必需，选择不同的 useQuery */
export type UseQueryDefinedInitialData<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> =
    IsParamRequired<TFn> extends true
        ? UseQueryDefinedInitialDataWithParams<TFn, TInitSelectData>
        : UseQueryDefinedInitialDataWithOptionalParams<TFn, TInitSelectData>

/** 未传递初始化参数的 createUseQuery 参数 */
export interface _CreateUseQueryUndefinedInitialDataParams<
    TFn extends (param: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> extends Omit<UndefinedInitialDataOptions<TResponse, Error, TInitSelectData, [string, TParams]>, "queryKey" | "queryFn"> {
    queryFn: TFn
    queryKey: string
}

export interface CreateUseQueryUndefinedInitialDataParams<
    TFn extends (param: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
> extends _CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData> {}

/** 未传递初始化参数的参数必需的 useQuery */
interface _UseQueryUndefinedInitialDataWithParams<
    TFn extends (params: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TInitSelectData>(
        params: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryUndefinedInitialDataWithParams<
    TFn extends (params: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
> extends _UseQueryUndefinedInitialDataWithParams<TFn, TInitSelectData> {}

/** 未传递初始化参数的参数可选的 useQuery */
interface _UseQueryUndefinedInitialDataWithOptionalParams<
    TFn extends (params: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> {
    <TData = TInitSelectData>(
        params?: TParams,
        options?: Omit<UndefinedInitialDataOptions<TResponse, Error, TData, [string, TParams]>, "queryKey" | "queryFn">,
        client?: QueryClient,
    ): UseQueryResult<NoInfer<TData>, Error>
}

export interface UseQueryUndefinedInitialDataWithOptionalParams<
    TFn extends (params?: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
> extends _UseQueryUndefinedInitialDataWithOptionalParams<TFn, TInitSelectData> {}

/** 根据参数是否必需，选择不同的 useQuery */
export type UseQueryUndefinedInitialData<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> =
    IsParamRequired<TFn> extends true
        ? UseQueryUndefinedInitialDataWithParams<TFn, TInitSelectData>
        : UseQueryUndefinedInitialDataWithOptionalParams<TFn, TInitSelectData>

export interface _CreateUseQueryParams<
    TFn extends (param: any) => any,
    TInitSelectData = Awaited<ReturnType<TFn>>,
    TParams = Parameters<TFn>[0],
    TResponse = Awaited<ReturnType<TFn>>,
> extends Omit<UseQueryOptions<TResponse, Error, TInitSelectData, [string, TParams]>, "queryKey" | "queryFn"> {
    queryFn: TFn
    queryKey: string
}

export interface CreateUseQueryParams<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> extends _CreateUseQueryParams<
    TFn,
    TInitSelectData
> {}

// 根据是否传递初始化参数，选择不同的 createUseQuery，目前存在一个问题，UndefinedInitialDataOptions 和 UseQueryOptions 是完全一致的，所以匹配不到第三种可能，但这是 @tanstack/react-query 的问题
export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>(
    params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>,
): UseQueryDefinedInitialData<TFn, TInitSelectData>
export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>(
    pararm: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>,
): UseQueryUndefinedInitialData<TFn, TInitSelectData>
export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>(
    pararm: CreateUseQueryParams<TFn, TInitSelectData>,
): UseQuery<TFn, TInitSelectData>
export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>({
    queryFn,
    queryKey,
    ...rest
}: CreateUseQueryParams<TFn, TInitSelectData>): UseQuery<TFn, TInitSelectData> {
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
