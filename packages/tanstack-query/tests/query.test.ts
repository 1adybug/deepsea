import { QueryClient } from "@tanstack/react-query"
import { act, renderHook, waitFor } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import { createUseMutation } from "../src/utils/createUseMutation"
import { createUseQuery } from "../src/utils/createUseQuery"

it("keys cached queries by parameters and applies refined selections", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })

    try {
        const queryFn = vi.fn(async (id: number) => ({ id, name: `item-${id}` }))
        const useItem = createUseQuery({ queryKey: "item", queryFn }, client)
        const useName = useItem.refine({ select: item => item.name })
        const { result } = renderHook(() => useName(2))
        await waitFor(() => expect(result.current.data).toBe("item-2"))
        expect(client.getQueryData(["item", 2])).toEqual({ id: 2, name: "item-2" })
        expect(queryFn).toHaveBeenCalledWith(2)
    } finally {
        client.clear()
    }
})

it("runs base and override mutation callbacks in order", async () => {
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false, gcTime: 0 } } })

    const callbacks: string[] = []

    try {
        const useSave = createUseMutation(
            {
                mutationFn: async (value: number) => value + 1,
                onSuccess: () => {
                    callbacks.push("base")
                },
            },
            client,
        )

        const { result } = renderHook(() =>
            useSave({
                onSuccess: () => {
                    callbacks.push("override")
                },
            }),
        )

        await act(async () => {
            expect(await result.current.mutateAsync(2)).toBe(3)
        })
        expect(callbacks).toEqual(["base", "override"])
    } finally {
        client.clear()
    }
})
