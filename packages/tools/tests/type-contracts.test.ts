import { expectTypeOf, it } from "vitest"

import {
    type Combine,
    type CombineAssign,
    type FlattenZodErrorResult,
    assign,
    createFnWithMiddleware,
    createRequestFn,
    getArray,
    getProperties,
} from "../src/index"

it("infers transformed object fields, middleware results and request results", () => {
    expectTypeOf<Combine<1, undefined>>().toEqualTypeOf<1>()
    expectTypeOf<CombineAssign<{ a: number }, { a: undefined; b: string }>>().toEqualTypeOf<{ a: number; b: string }>()
    expectTypeOf(assign({ a: 1 }, { a: undefined, b: "label" })).toEqualTypeOf<{ a: number; b: string }>()
    expectTypeOf(getArray(2, index => String(index))).toEqualTypeOf<string[]>()
    expectTypeOf(getProperties({ id: 1, label: "a" }, "id")).toEqualTypeOf<{ id: number }>()
    const wrapped = createFnWithMiddleware((id: number) => ({ id }))
    expectTypeOf(wrapped).returns.toEqualTypeOf<Promise<{ id: number }>>()
    const request = createRequestFn(async (id: number) => ({ success: true, data: { id } }))
    expectTypeOf(request).parameter(0).toEqualTypeOf<number>()
    expectTypeOf(request).returns.toEqualTypeOf<Promise<{ id: number }>>()
    expectTypeOf<FlattenZodErrorResult<true, true>>().toEqualTypeOf<{ message: string; path: string[] }>()
    expectTypeOf<FlattenZodErrorResult<true, false>>().toEqualTypeOf<{ message: string; path: string }>()
})
