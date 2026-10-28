import type { Field } from "@1adybug/tanstack-form"
import { expectTypeOf } from "vitest"

import { type EnumValue, type SelectValue, EnumSelect } from "../src/components/EnumSelect"
import { FormCheckbox } from "../src/components/FormCheckbox"
import { FormInput } from "../src/components/FormInput"
import { FormNumberInput } from "../src/components/FormNumberInput"
import { FormSelect } from "../src/components/FormSelect"

import type { TimeValueModeMap } from "../src/utils/time"

declare const textField: Field<string>
declare const numberField: Field<number>
declare const booleanField: Field<boolean>
declare const multipleField: Field<string[]>

type Options = { Ready: "ready"; Idle: "idle" }

expectTypeOf<EnumValue<Options>>().toEqualTypeOf<"ready" | "idle">()
expectTypeOf<SelectValue<Options, "multiple">>().toEqualTypeOf<("ready" | "idle")[]>()
expectTypeOf<SelectValue<Options, "single", true>>().toEqualTypeOf<"ready" | "idle">()
expectTypeOf<TimeValueModeMap<"date">>().toEqualTypeOf<Date>()
expectTypeOf<TimeValueModeMap<"timestamp">>().toEqualTypeOf<number>()
const text = <FormInput field={textField} />
const number = <FormNumberInput field={numberField} />
const checkbox = <FormCheckbox field={booleanField} />
const multiple = <FormSelect selectionMode="multiple" field={multipleField} children={[]} />

const select = (
    <EnumSelect
        enumObject={{ Ready: "ready", Idle: "idle" } as const}
        onValueChange={value => {
            expectTypeOf(value).toEqualTypeOf<"ready" | "idle" | null>()
        }}
    />
)

// @ts-expect-error Text adapters must reject numeric field values.
const invalid = <FormInput field={numberField} />

void [text, number, checkbox, multiple, select, invalid]
