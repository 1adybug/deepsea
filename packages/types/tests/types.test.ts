import { expectTypeOf, it } from "vitest"

import type { Equal, IsNever, IsRequired, KeyOfUnion, UnionToIntersection } from "../src/index"

it("preserves equality, never, optional keys and union contracts", () => {
    expectTypeOf<Equal<string, string>>().toEqualTypeOf<true>()
    expectTypeOf<Equal<string, number>>().toEqualTypeOf<false>()
    expectTypeOf<IsNever<never>>().toEqualTypeOf<true>()
    expectTypeOf<IsRequired<{ id: number; label?: string }, "label">>().toEqualTypeOf<false>()
    expectTypeOf<KeyOfUnion<{ id: number } | { name: string }>>().toEqualTypeOf<"id" | "name">()
    expectTypeOf<UnionToIntersection<{ id: number } | { name: string }>>().toEqualTypeOf<{ id: number } & { name: string }>()
})
