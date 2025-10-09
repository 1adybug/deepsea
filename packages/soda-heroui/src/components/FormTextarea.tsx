"use client"

import { As, MergeWithAs, TextAreaProps, Textarea } from "@heroui/react"
import { ComponentPropsWithoutRef, ReactNode } from "react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormTextareaProps<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "textarea"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    TextAreaProps,
    AsComponent
> & {
    field: Field<FieldValue>
    component?: <AsComponent extends As = "textarea">(
        props: MergeWithAs<ComponentPropsWithoutRef<"textarea">, ComponentPropsWithoutRef<AsComponent>, TextAreaProps, AsComponent>,
    ) => ReactNode
}

export function FormTextarea<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "textarea">({
    field,
    component: Textarea2 = Textarea,
    ...rest
}: FormTextareaProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Textarea2<AsComponent>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
