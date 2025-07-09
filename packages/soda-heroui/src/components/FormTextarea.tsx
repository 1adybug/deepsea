"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { As, MergeWithAs, TextAreaProps, Textarea } from "@heroui/react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormTextareaProps<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "textarea"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    TextAreaProps,
    AsComponent
> & {
    field: Field<FieldValue>
}

export function FormTextarea<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "textarea">({
    field,
    ...rest
}: FormTextareaProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Textarea<AsComponent>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
