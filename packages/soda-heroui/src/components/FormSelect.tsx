"use client"

import { ReactNode, useContext } from "react"
import { Select, SelectProps } from "@heroui/react"
import { Key } from "@react-types/shared"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { EmptyValue, FormContext, getEmptyValue } from "./FormProvider"

export type SelectionMode = "single" | "multiple"

export interface FormSelectProps<
    Mode extends SelectionMode = "single",
    Value extends (Mode extends "multiple" ? Key[] : Key) | null | undefined = (Mode extends "multiple" ? Key[] : Key) | null | undefined,
    RenderItem extends object = object,
> extends StrictOmit<FieldComponentProps<typeof Select<RenderItem>, Value>, "selectionMode"> {
    selectionMode?: Mode
    emptyValue?: EmptyValue
    component?: <RenderItem extends object>(props: SelectProps<RenderItem>) => ReactNode
}

export function FormSelect<
    Mode extends SelectionMode = "single",
    Value extends (Mode extends "multiple" ? Key[] : Key) | null | undefined = (Mode extends "multiple" ? Key[] : Key) | null | undefined,
    RenderItem extends object = object,
>({ field, multiple, emptyValue, component: Select2 = Select, ...rest }: FormSelectProps<Mode, Value, RenderItem>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <Select2<RenderItem>
            selectedKeys={isNonNullable(field.state.value) ? (multiple ? (field.state.value as Key[]) : [field.state.value as Key]) : []}
            onSelectionChange={keys => {
                const value = Array.from(keys)
                field.handleChange((multiple ? value : (value.at(0) ?? getEmptyValue(emptyValue))) as Value)
            }}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
