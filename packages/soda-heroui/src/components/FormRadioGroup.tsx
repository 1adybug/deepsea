"use client"

/* eslint-disable no-restricted-syntax */

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type As, type MergeWithAs, type RadioGroupProps, RadioGroup } from "@heroui/react"
import type { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormRadioGroupProps<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "div"> = MergeWithAs<
    ComponentPropsWithoutRef<"div">,
    ComponentPropsWithoutRef<AsComponent>,
    RadioGroupProps,
    AsComponent
> & {
    field: Field<FieldValue>
    component?: <AsComponent extends As = "div">(
        props: MergeWithAs<ComponentPropsWithoutRef<"div">, ComponentPropsWithoutRef<AsComponent>, RadioGroupProps, AsComponent>,
    ) => ReactNode
}

export function FormRadioGroup<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "div">({
    field,
    component: RadioGroup2 = RadioGroup,
    ...rest
}: FormRadioGroupProps<FieldValue, AsComponent>): ReactNode {
    return (
        <RadioGroup2<AsComponent>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
