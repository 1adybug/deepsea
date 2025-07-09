"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { As, Input, InputProps, MergeWithAs } from "@heroui/react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormInputProps<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "input"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    InputProps,
    AsComponent
> & {
    field: Field<FieldValue>
}

export function FormInput<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "input">({
    field,
    ...rest
}: FormInputProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Input<AsComponent> value={field.state.value ?? ""} onValueChange={field.handleChange as (value: string) => void} {...getFieldProps(field)} {...rest} />
    )
}
