import type { ComponentProps } from "react"

import { expectTypeOf } from "vitest"

import { type MustBeReactKey, type MustBeReactNode, DraggableGrid } from "../src/components/DraggableGrid"
import { Flow } from "../src/components/Flow"
import { type DataType, type ValueType, InputFile } from "../src/components/InputFile"
import type { Unify } from "../src/components/Unify"

expectTypeOf<MustBeReactKey<string | number>>().toEqualTypeOf<true>()
expectTypeOf<MustBeReactKey<{ id: string }>>().toEqualTypeOf<false>()
expectTypeOf<MustBeReactNode<{ id: string }>>().toEqualTypeOf<false>()
expectTypeOf<ValueType<true, "text">>().toEqualTypeOf<string[]>()
expectTypeOf<DataType<false, "file">>().toEqualTypeOf<{ file: File; value: File }>()
expectTypeOf<ComponentProps<typeof Unify<"button">>>().toHaveProperty("disabled")

const text = (
    <InputFile
        type="text"
        onValueChange={value => {
            expectTypeOf(value).toEqualTypeOf<string>()
        }}
    />
)

const multiple = (
    <InputFile
        multiple
        type="arrayBuffer"
        onValueChange={values => {
            expectTypeOf(values).toEqualTypeOf<ArrayBuffer[]>()
        }}
    />
)

const flow = (
    <Flow
        data={[{ id: 1 }]}
        itemWidth={100}
        itemHeight={20}
        render={item => {
            expectTypeOf(item).toEqualTypeOf<{ id: number }>()
            return item.id
        }}
    />
)

const grid = (
    <DraggableGrid items={[{ id: "a" }]} keyExtractor={item => item.id} render={item => item.id} columns={1} rows={1} itemWidth={100} itemHeight={20} />
)

// @ts-expect-error Object items need an explicit key extractor and renderer.
const invalidGrid = <DraggableGrid items={[{ id: "a" }]} columns={1} rows={1} itemWidth={100} itemHeight={20} />

// @ts-expect-error Text-mode callbacks receive strings.
const invalidFile = <InputFile type="text" onValueChange={(value: number) => value} />

void [text, multiple, flow, grid, invalidGrid, invalidFile]
