import {
    DefinedInitialDataOptions,
    DefinedUseQueryResult,
    QueryClient,
    UndefinedInitialDataOptions,
    useQuery,
    UseQueryOptions,
    UseQueryResult,
} from "@tanstack/react-query"
import { Assign, IsParamRequired, StrictPartial } from "soda-type"

// 要在第一个加一个重载，因为 options 是可选的，如果不加这个重载，options 类型会匹配到 DefinedInitialDataOptions，会误认为 initialData 被传递了，造成返回类型必定不为 undefined

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
type _UseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> =
    IsParamRequired<TFn> extends true ? UseQueryWithParams<TFn, TInitSelectData> : UseQueryWithOptionalParams<TFn, TInitSelectData>

export type UseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> = _UseQuery<TFn, TInitSelectData> & {
    refine<TRefineParams extends StrictPartial<CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryParams<TFn, TInitSelectData>, TRefineParams>>
    refine<TRefineParams extends StrictPartial<CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryParams<TFn, TInitSelectData>, TRefineParams>>
    refine<TRefineParams extends StrictPartial<CreateUseQueryParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryParams<TFn, TInitSelectData>, TRefineParams>>
}

/** 传递了初始化参数的 createUseQuery 参数 */
interface _CreateUseQueryDefinedInitialDataParams<
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
export type _UseQueryDefinedInitialData<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> =
    IsParamRequired<TFn> extends true
        ? UseQueryDefinedInitialDataWithParams<TFn, TInitSelectData>
        : UseQueryDefinedInitialDataWithOptionalParams<TFn, TInitSelectData>

export type UseQueryDefinedInitialData<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> = _UseQueryDefinedInitialData<
    TFn,
    TInitSelectData
> & {
    refine<TRefineParams extends StrictPartial<CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, TRefineParams>>
    refine<TRefineParams extends StrictPartial<CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, TRefineParams>>
    refine<TRefineParams extends StrictPartial<CreateUseQueryParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, TRefineParams>>
}

/** 未传递初始化参数的 createUseQuery 参数 */
interface _CreateUseQueryUndefinedInitialDataParams<
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
type _UseQueryUndefinedInitialData<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> =
    IsParamRequired<TFn> extends true
        ? UseQueryUndefinedInitialDataWithParams<TFn, TInitSelectData>
        : UseQueryUndefinedInitialDataWithOptionalParams<TFn, TInitSelectData>

export type UseQueryUndefinedInitialData<TFn extends (params?: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>> = _UseQueryUndefinedInitialData<
    TFn,
    TInitSelectData
> & {
    refine<TRefineParams extends StrictPartial<CreateUseQueryDefinedInitialDataParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, TRefineParams>>
    refine<TRefineParams extends StrictPartial<CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, TRefineParams>>
    refine<TRefineParams extends StrictPartial<CreateUseQueryParams<TFn, TInitSelectData>, "queryKey" | "queryFn">>(
        params: TRefineParams | ((params: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => TRefineParams),
        client?: QueryClient | ((params: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, client?: QueryClient) => QueryClient | undefined),
    ): GetHookFromParams<Assign<CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>, TRefineParams>>
}

interface _CreateUseQueryParams<
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
    client?: QueryClient,
): UseQueryDefinedInitialData<TFn, TInitSelectData>
export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>(
    pararm: CreateUseQueryUndefinedInitialDataParams<TFn, TInitSelectData>,
    client?: QueryClient,
): UseQueryUndefinedInitialData<TFn, TInitSelectData>
export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>(
    pararm: CreateUseQueryParams<TFn, TInitSelectData>,
    client?: QueryClient,
): UseQuery<TFn, TInitSelectData>

export function createUseQuery<TFn extends (param: any) => any, TInitSelectData = Awaited<ReturnType<TFn>>>(
    params: CreateUseQueryParams<TFn, TInitSelectData>,
    client?: QueryClient,
): any {
    const { queryFn, queryKey, ...rest } = params

    const useRequest: any = function useRequest(params2: any, options?: any, client2: QueryClient | undefined = client) {
        return useQuery(
            {
                queryKey: [queryKey, params2],
                queryFn: () => queryFn(params2),
                ...rest,
                ...options,
            },
            client2,
        )
    }

    useRequest.refine = function refine(params2: any, client2?: any) {
        params2 = typeof params2 === "function" ? params2(params, client) : params2
        client2 = typeof client2 === "function" ? client2(params, client) : client2
        return createUseQuery({ ...params, ...params2 }, client2 ?? client)
    }
}

export type GetHookFromParams<Params> =
    Params extends CreateUseQueryDefinedInitialDataParams<infer TFn, infer TInitSelectData>
        ? UseQueryDefinedInitialData<TFn, TInitSelectData>
        : Params extends CreateUseQueryUndefinedInitialDataParams<infer TFn, infer TInitSelectData>
          ? UseQueryUndefinedInitialData<TFn, TInitSelectData>
          : Params extends CreateUseQueryParams<infer TFn, infer TInitSelectData>
            ? UseQuery<TFn, TInitSelectData>
            : never
