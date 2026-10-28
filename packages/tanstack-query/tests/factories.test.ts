import { useQuery as originalUseQuery, QueryClient } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import { createUseMutation, withUseMutationDefaults } from "../src/utils/createUseMutation"
import { createUseQuery, setUseQuery } from "../src/utils/createUseQuery"

const clients: QueryClient[] = []

function client() {
    const value = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false, gcTime: 0 } } })
    clients.push(value)
    return value
}

afterEach(() => {
    clients.splice(0).forEach(value => value.clear())
    setUseQuery(originalUseQuery)
})

it("supports disabled queries, initial data, parameter changes and custom clients", async () => {
    const base = client(),
        override = client(),
        query = vi.fn(async (id: number) => ({ id }))

    const useItem = createUseQuery({ queryKey: "items", queryFn: query }, base)

    const { result, rerender } = renderHook(({ id, enabled }) => useItem(id, { enabled, initialData: { id: 0 } }, override), {
        initialProps: { id: 1, enabled: false },
    })

    expect(result.current.data).toEqual({ id: 0 })
    expect(query).not.toHaveBeenCalled()
    rerender({ id: 2, enabled: true })
    await waitFor(() => expect(result.current.data).toEqual({ id: 2 }))
    expect(base.getQueryData(["items", 2])).toBeUndefined()
    expect(override.getQueryData(["items", 2])).toEqual({ id: 2 })
})

it("refines options and client through factories and uses an injected query hook", () => {
    const base = client(),
        override = client()

    const queryFn = async (id: number) => id
    const hook = vi.fn(() => ({ data: "result" }))
    setUseQuery(hook as never)
    const useItem = createUseQuery({ queryKey: "item", queryFn }, base)
    const params = vi.fn(() => ({ staleTime: 100 }))

    const refined = useItem.refine(params, (_options, initial) => {
        expect(initial).toBe(base)
        return override
    })

    expect(refined(3)).toEqual({ data: "result" })
    expect(hook).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ["item", 3], staleTime: 100 }), override)
    expect(params).toHaveBeenCalledWith({ queryKey: "item", queryFn }, base)
})

it("propagates query failures without losing the original error", async () => {
    const failure = new Error("offline")

    const useFailure = createUseQuery(
        {
            queryKey: "failure",
            queryFn: async () => {
                throw failure
            },
        },
        client(),
    )

    const { result } = renderHook(() => useFailure())
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBe(failure)
})

it("runs mutation lifecycle callbacks in order and forwards override context on failure", async () => {
    const order: string[] = [],
        failure = new Error("denied")

    const useSave = createUseMutation(
        {
            mutationFn: async (_value: number) => {
                throw failure
            },
            onMutate: () => {
                order.push("base:mutate")
            },
            onError: () => {
                order.push("base:error")
            },
            onSettled: () => {
                order.push("base:settled")
            },
        },
        client(),
    )

    const onError = vi.fn(() => {
        order.push("override:error")
    })

    const { result } = renderHook(() =>
        useSave({
            onMutate: () => {
                order.push("override:mutate")
                return "context"
            },
            onError,
            onSettled: () => {
                order.push("override:settled")
            },
        }),
    )

    await act(async () => {
        await expect(result.current.mutateAsync(1)).rejects.toBe(failure)
    })
    expect(order).toEqual(["base:mutate", "override:mutate", "base:error", "override:error", "base:settled", "override:settled"])
    expect(onError.mock.calls[0]).toEqual(expect.arrayContaining([failure, 1, "context"]))
})

it("evaluates mutation default factories on each render and allows overrides", async () => {
    const defaults = vi.fn(() => ({ retry: false as const, onSuccess: vi.fn() }))
    const useSave = withUseMutationDefaults<(value: number) => Promise<number>>(defaults)(async value => value + 1, client())
    const success = vi.fn()
    const { result, rerender } = renderHook(() => useSave({ onSuccess: success }))
    rerender()
    expect(defaults.mock.calls.length).toBeGreaterThanOrEqual(2)
    await act(async () => {
        expect(await result.current.mutateAsync(1)).toBe(2)
    })
    expect(success).toHaveBeenCalledTimes(1)
})
