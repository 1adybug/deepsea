"use client"

/* eslint-disable no-restricted-syntax */

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type As, type CheckboxProps, type MergeWithAs, Checkbox } from "@heroui/react"
import type { Field } from "soda-tanstack-form"

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
