"use client"

import { ReactNode } from "react"
import { SelectItem } from "@heroui/react"
import { EnumOption, getEnumOptions } from "deepsea-tools"
import { StrictOmit, ValueOf } from "soda-type"

import { FormSelect, FormSelectProps, SelectionMode } from "./FormSelect"

export interface EnumSelectProps<
    T extends Record<string, string>,
    Mode extends SelectionMode = "single",
    FieldValue extends (Mode extends "multiple" ? ValueOf<T>[] : ValueOf<T>) | null | undefined =
        | (Mode extends "multiple" ? ValueOf<T>[] : ValueOf<T>)
        | null
        | undefined,
> extends StrictOmit<FormSelectProps<Mode, FieldValue, EnumOption<T>>, "children" | "items"> {
    enumObject: T
}

export function EnumSelect<
    T extends Record<string, string>,
    Mode extends SelectionMode = "single",
    FieldValue extends (Mode extends "multiple" ? ValueOf<T>[] : ValueOf<T>) | null | undefined =
        | (Mode extends "multiple" ? ValueOf<T>[] : ValueOf<T>)
        | null
        | undefined,
>({ enumObject, ...rest }: EnumSelectProps<T, Mode, FieldValue>): ReactNode {
    return (
        <FormSelect items={getEnumOptions(enumObject)} {...rest}>
            {({ label, value }) => <SelectItem key={value}>{label}</SelectItem>}
        </FormSelect>
    )
}

export function createEnumSelect<T extends Record<string, string>>(enumObject: T) {
    return function FormSelect<
        Mode extends SelectionMode = "single",
        FieldValue extends (Mode extends "multiple" ? ValueOf<T>[] : ValueOf<T>) | null | undefined =
            | (Mode extends "multiple" ? ValueOf<T>[] : ValueOf<T>)
            | null
            | undefined,
    >(props: StrictOmit<EnumSelectProps<T, Mode, FieldValue>, "enumObject">) {
        return <EnumSelect enumObject={enumObject} {...props} />
    }
}
