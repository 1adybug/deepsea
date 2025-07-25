"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { As, Checkbox, CheckboxProps, MergeWithAs } from "@heroui/react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormCheckboxProps<FieldValue extends boolean | null | undefined = boolean | null | undefined, AsComponent extends As = "input"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    CheckboxProps,
    AsComponent
> & {
    field: Field<FieldValue>
    component?: <AsComponent extends As = "input">(
        props: MergeWithAs<ComponentPropsWithoutRef<"input">, ComponentPropsWithoutRef<AsComponent>, CheckboxProps, AsComponent>,
    ) => ReactNode
}

export function FormCheckbox<FieldValue extends boolean | null | undefined = boolean | null | undefined, AsComponent extends As = "input">({
    field,
    component: Checkbox2 = Checkbox,
    ...rest
}: FormCheckboxProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Checkbox2<AsComponent>
            isSelected={field.state.value ?? false}
            onValueChange={field.handleChange as (value: boolean) => void}
            {...getFieldProps(field, true)}
            {...rest}
        />
    )
}
