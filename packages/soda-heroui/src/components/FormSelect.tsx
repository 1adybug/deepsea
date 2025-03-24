"use client"

import { Select } from "@heroui/react"
import { Key } from "@react-types/shared"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormSelectProps<
    Value extends Key | undefined = Key | undefined,
    Multiple extends boolean = false,
    T extends object = object,
    FieldValue = Multiple extends true ? Value[] : Value,
> extends StrictOmit<FieldComponentProps<typeof Select<T>, FieldValue>, "multiple"> {
    multiple?: Multiple
}

export function FormSelect<
    Value extends Key | undefined = Key | undefined,
    Multiple extends boolean = false,
    T extends object = object,
    FieldValue = Multiple extends true ? Value[] : Value,
>({ field, multiple, ...rest }: FormSelectProps<Value, Multiple, T, FieldValue>) {
    return (
        <Select<T>
            selectedKeys={
                Array.isArray(field.state.value) ? field.state.value.filter(isNonNullable) : isNonNullable(field.state.value) ? [field.state.value] : []
            }
            onSelectionChange={keys => {
                const value = Array.from(keys) as string[]
                field.handleChange((multiple ? value : value.at(0)) as FieldValue)
            }}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
