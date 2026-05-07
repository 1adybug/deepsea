import { DefaultError, QueryClient, useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query"

type MutationFn = (param: any) => any

export type CreateUseMutationOptions<TMutationFn extends MutationFn> = Omit<
    UseMutationOptions<Awaited<ReturnType<TMutationFn>>, unknown, Parameters<TMutationFn>[0], unknown>,
    "mutationFn"
> & {
    mutationFn: TMutationFn
}

export type UseConfiguredMutation<TMutationFn extends MutationFn> = <TError = DefaultError, TOnMutateResult = unknown>(
    options?: Omit<UseMutationOptions<Awaited<ReturnType<TMutationFn>>, TError, Parameters<TMutationFn>[0], TOnMutateResult>, "mutationFn">,
    queryClient?: QueryClient,
) => UseMutationResult<Awaited<ReturnType<TMutationFn>>, TError, Parameters<TMutationFn>[0], TOnMutateResult>

export function createUseMutation<TMutationFn extends MutationFn>(
    baseOptions: CreateUseMutationOptions<TMutationFn> | (() => CreateUseMutationOptions<TMutationFn>),
    baseQueryClient?: QueryClient,
) {
    return function useConfiguredMutation<TError = DefaultError, TOnMutateResult = unknown>(
        {
            onMutate: overrideOnMutate,
            onSuccess: overrideOnSuccess,
            onError: overrideOnError,
            onSettled: overrideOnSettled,
            ...overrideOptions
        }: Omit<UseMutationOptions<Awaited<ReturnType<TMutationFn>>, TError, Parameters<TMutationFn>[0], TOnMutateResult>, "mutationFn"> = {},
        overrideQueryClient?: QueryClient,
    ) {
        const {
            mutationFn,
            onMutate: baseOnMutate,
            onSuccess: baseOnSuccess,
            onError: baseOnError,
            onSettled: baseOnSettled,
            ...baseOptionsRest
        } = typeof baseOptions === "function" ? baseOptions() : baseOptions
        return useMutation<Awaited<ReturnType<TMutationFn>>, TError, Parameters<TMutationFn>[0], TOnMutateResult>(
            {
                mutationFn,
                async onMutate(variables, context) {
                    await baseOnMutate?.(variables, context)
                    return overrideOnMutate?.(variables, context) as TOnMutateResult
                },
                async onSuccess(data, variables, onMutateResult, context) {
                    await baseOnSuccess?.(data, variables, onMutateResult, context)
                    return overrideOnSuccess?.(data, variables, onMutateResult, context)
                },
                async onError(error, variables, onMutateResult, context) {
                    await baseOnError?.(error, variables, onMutateResult, context)
                    return overrideOnError?.(error, variables, onMutateResult, context)
                },
                async onSettled(data, error, variables, onMutateResult, context) {
                    await baseOnSettled?.(data, error, variables, onMutateResult, context)
                    return overrideOnSettled?.(data, error, variables, onMutateResult, context)
                },
                ...baseOptionsRest,
                ...overrideOptions,
            },
            overrideQueryClient ?? baseQueryClient,
        )
    }
}

export function withUseMutationDefaults<TMutationFn extends MutationFn>(
    defaultOptions: Omit<CreateUseMutationOptions<TMutationFn>, "mutationFn"> | (() => Omit<CreateUseMutationOptions<TMutationFn>, "mutationFn">) = {},
) {
    return function bindMutation(mutationFn: TMutationFn, queryClient?: QueryClient) {
        return createUseMutation(() => {
            const resolvedDefaultOptions = typeof defaultOptions === "function" ? defaultOptions() : defaultOptions
            return {
                mutationFn,
                ...resolvedDefaultOptions,
            }
        }, queryClient)
    }
}
