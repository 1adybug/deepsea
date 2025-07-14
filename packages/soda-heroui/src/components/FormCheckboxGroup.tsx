"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { As, CheckboxGroup, CheckboxGroupProps, MergeWithAs } from "@heroui/react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormCheckboxGroupProps<FieldValue extends string[] | null | undefined = string[] | null | undefined, AsComponent extends As = "div"> = MergeWithAs<
    ComponentPropsWithoutRef<"div">,
    ComponentPropsWithoutRef<AsComponent>,
    CheckboxGroupProps,
    AsComponent
> & {
    field: Field<FieldValue>
    component?: <AsComponent extends As = "div">(
        props: MergeWithAs<ComponentPropsWithoutRef<"div">, ComponentPropsWithoutRef<AsComponent>, CheckboxGroupProps, AsComponent>,
    ) => ReactNode
}

export function FormCheckboxGroup<FieldValue extends string[] | null | undefined = string[] | null | undefined, AsComponent extends As = "div">({
    field,
    component: CheckboxGroup2 = CheckboxGroup,
    ...rest
}: FormCheckboxGroupProps<FieldValue, AsComponent>): ReactNode {
    return (
        <CheckboxGroup2<AsComponent>
            value={field.state.value ?? []}
            onValueChange={field.handleChange as (value: string[]) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
