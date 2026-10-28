import { expectTypeOf, it } from "vitest"

import type * as T from "../src/index"

it("computes union keys, values, required keys and member categories", () => {
    type Union = { id: number; a?: string } | { id: number; b: boolean }

    expectTypeOf<T.IsNever<string>>().toEqualTypeOf<false>()
    expectTypeOf<T.LastUnion<"one">>().toEqualTypeOf<"one">()
    expectTypeOf<T.UnionToTuple<never>>().toEqualTypeOf<[]>()
    expectTypeOf<T.UnionToTuple<"a" | "b">[number]>().toEqualTypeOf<"a" | "b">()
    expectTypeOf<T.IsRequired<Union, "id">>().toEqualTypeOf<true>()
    expectTypeOf<T.IsOptionalInUnion<Union, "a">>().toEqualTypeOf<true>()
    expectTypeOf<T.IsRequiredInUnion<Union, "id">>().toEqualTypeOf<true>()
    expectTypeOf<T.OptionalKeysInUnion<Union>>().toEqualTypeOf<"a" | "b">()
    expectTypeOf<T.RequiredKeysInUnion<Union>>().toEqualTypeOf<"id">()
    expectTypeOf<T.PossibleValuesInUnion<Union, "a">>().toEqualTypeOf<string | undefined>()
    expectTypeOf<T.IsObject<{ id: number }>>().toEqualTypeOf<true>()
    expectTypeOf<T.IsObject<number[]>>().toEqualTypeOf<false>()
    expectTypeOf<T.IsObject<() => void>>().toEqualTypeOf<false>()
    expectTypeOf<T.ObjectInUnion<string | number[] | { id: 1 }>>().toEqualTypeOf<{ id: 1 }>()
    expectTypeOf<T.ArrayInUnion<string | number[] | { id: 1 }>>().toEqualTypeOf<number[]>()
    expectTypeOf<T.NonObjectOrArrayInUnion<string | number[] | { id: 1 }>>().toEqualTypeOf<string>()
    expectTypeOf<T.CombineUnion<Union>>().toMatchTypeOf<{ id: number; a?: string; b?: boolean }>()
    expectTypeOf<T.CombineUnion<number[] | string[]>>().toEqualTypeOf<(number | string)[]>()
})

it("distinguishes JSON-compatible values from functions, bigint and symbol keys", () => {
    expectTypeOf<T.CommonType>().toEqualTypeOf<string | number | boolean | null | undefined>()
    expectTypeOf<T.CanJSONStringify<{ items: { id: number }[]; empty: null }>>().toEqualTypeOf<true>()
    expectTypeOf<T.CanJSONStringify<() => void>>().toEqualTypeOf<false>()
    expectTypeOf<T.CanJSONStringify<bigint>>().toEqualTypeOf<false>()
    expectTypeOf<T.CanJSONStringify<never>>().toEqualTypeOf<false>()
    expectTypeOf<T.CanJSONStringify<{ [key: symbol]: string }>>().toEqualTypeOf<false>()
    expectTypeOf<"custom">().toMatchTypeOf<T.TipString<"known">>()
})

it("applies strict property transforms and rejects misspelled keys", () => {
    type Model = { id: number; label: string; extra?: boolean }

    expectTypeOf<T.StrictOmit<Model, "id">>().toEqualTypeOf<{ label: string; extra?: boolean }>()
    expectTypeOf<T.StrictPartial<Model, "label">>().toMatchTypeOf<{ id: number; label?: string }>()
    expectTypeOf<T.StrictRequired<Model, "extra">>().toMatchTypeOf<{ id: number; label: string; extra: boolean }>()
    expectTypeOf<T.ValueOf<{ a: 1; b: "two" }>>().toEqualTypeOf<1 | "two">()
    expectTypeOf<T.FirstParameter<(id: number, label: string) => void>>().toEqualTypeOf<number>()
    expectTypeOf<T.Assign<{ a: 1; b: 2 }, { b: "new"; c: 3 }>>().toEqualTypeOf<{ a: 1; b: "new"; c: 3 }>()
    expectTypeOf<T.EditorProps<{ id: number }>["id"]>().toEqualTypeOf<number | undefined>()

    const readonly: T.StrictReadonly<Model, "id"> = { id: 1, label: "label" }

    // @ts-expect-error The selected property must remain readonly.
    readonly.id = 2
    readonly.label = "editable"

    // @ts-expect-error StrictOmit only accepts existing keys.
    type Invalid = T.StrictOmit<Model, "misspelled">

    expectTypeOf<Invalid>().toBeObject()
})

it("maps timestamps to query ranges and restores form fields with optionality", () => {
    type Model = { name: string; createdAt: Date; updatedAt?: Date }

    type Query = T.QueryParams<Model, number>

    expectTypeOf<Query>().toMatchTypeOf<{ name: string; createdAfter: number; createdBefore: number; updatedAfter?: number; updatedBefore?: number }>()
    expectTypeOf<T.QueryParams<{ savedTime: Date }, string, "Time">>().toMatchTypeOf<{ savedAfter: string; savedBefore: string }>()
    expectTypeOf<T.QueryFormData<Query, Date>>().toMatchTypeOf<Model>()
    expectTypeOf<T.QueryParams<Model, number, "At", "name">>().toMatchTypeOf<{ name: string }>()
    expectTypeOf<T.TupleToObject<[{ a: 1 }, { b: 2 }]>>().toEqualTypeOf<{ a: 1 } & { b: 2 }>()
})

it("handles tuple indices, string keys and function parameter optionality", () => {
    expectTypeOf<T.GetIndices<readonly ["a", "b", "c"]>>().toEqualTypeOf<0 | 1 | 2>()
    expectTypeOf<T.GetIndices<[]>>().toEqualTypeOf<never>()
    expectTypeOf<T.GetIndex<readonly ["a", "b", "a"], "a">>().toEqualTypeOf<0 | 2>()
    expectTypeOf<T.StrKeyOf<{ name: string }>>().toEqualTypeOf<"name">()
    expectTypeOf<T.StrKeyOf<{ 1: string }>>().toEqualTypeOf<never>()
    expectTypeOf<T.IsParamRequired<(id: number) => void>>().toEqualTypeOf<true>()
    expectTypeOf<T.IsParamRequired<(id?: number) => void>>().toEqualTypeOf<false>()
    expectTypeOf<T.IsParamRequired<() => void>>().toEqualTypeOf<false>()
})
