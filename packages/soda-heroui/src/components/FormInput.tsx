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
    component?: <AsComponent extends As = "input">(
        props: MergeWithAs<ComponentPropsWithoutRef<"input">, ComponentPropsWithoutRef<AsComponent>, InputProps, AsComponent>,
    ) => ReactNode
}

export function FormInput<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "input">({
    field,
    component: Input2 = Input,
    ...rest
}: FormInputProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Input2<AsComponent>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
