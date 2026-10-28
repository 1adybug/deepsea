import { expectTypeOf } from "vitest"

import { createUseMutation } from "../src/utils/createUseMutation"
import { createUseQuery } from "../src/utils/createUseQuery"

const useItem = createUseQuery({ queryKey: "item", queryFn: async (id: number) => ({ id, label: "Item" }) })
const useLabel = useItem.refine({ select: item => item.label })
const useInitial = createUseQuery({ queryKey: "initial", queryFn: async (id?: number) => id ?? 0, initialData: 0 })
const useSave = createUseMutation({ mutationFn: async (value: { name: string }) => ({ id: 1, ...value }) })

function useTypeContracts() {
    expectTypeOf(useItem(1).data).toEqualTypeOf<{ id: number; label: string } | undefined>()
    expectTypeOf(useLabel(1).data).toEqualTypeOf<string | undefined>()
    expectTypeOf(useInitial().data).toEqualTypeOf<number>()
    const mutation = useSave()
    expectTypeOf(mutation.mutateAsync).parameter(0).toEqualTypeOf<{ name: string }>()
    expectTypeOf(mutation.mutateAsync).returns.toEqualTypeOf<Promise<{ id: number; name: string }>>()

    // @ts-expect-error The required query parameter cannot be omitted.
    useItem()

    // @ts-expect-error Query input must preserve the original parameter type.
    useItem("wrong")

    // @ts-expect-error Mutation input is checked at the call boundary.
    mutation.mutate({ id: 1 })
}

void useTypeContracts
