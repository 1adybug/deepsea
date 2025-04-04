"use client"

import { ReactNode } from "react"
import { Select } from "@heroui/react"
import { Key } from "@react-types/shared"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormSelectProps<
    Multiple extends boolean = false,
    Value extends (Multiple extends true ? Key[] : Key) | undefined = (Multiple extends true ? Key[] : Key) | undefined,
    RenderItem extends object = object,
> extends StrictOmit<FieldComponentProps<typeof Select<RenderItem>, Value>, "multiple"> {
    multiple?: Multiple
}

export function FormSelect<
    Multiple extends boolean = false,
    Value extends (Multiple extends true ? Key[] : Key) | undefined = (Multiple extends true ? Key[] : Key) | undefined,
    RenderItem extends object = object,
>({ field, multiple, ...rest }: FormSelectProps<Multiple, Value, RenderItem>): ReactNode {
    return (
        <Select<RenderItem>
            selectedKeys={isNonNullable(field.state.value) ? (multiple ? (field.state.value as Key[]) : [field.state.value as Key]) : []}
            onSelectionChange={keys => {
                const value = Array.from(keys)
                field.handleChange((multiple ? value : value.at(0)) as Value)
            }}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
