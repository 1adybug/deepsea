"use client"

/* eslint-disable no-restricted-syntax */

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type As, type MergeWithAs, type NumberInputProps, NumberInput } from "@heroui/react"
import type { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormNumberInputProps<FieldValue extends number | null | undefined = number | null | undefined, AsComponent extends As = "input"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    NumberInputProps,
    AsComponent
> & {
    field: Field<FieldValue>
    component?: <AsComponent extends As = "input">(
        props: MergeWithAs<ComponentPropsWithoutRef<"input">, ComponentPropsWithoutRef<AsComponent>, NumberInputProps, AsComponent>,
    ) => ReactNode
}

export function FormNumberInput<FieldValue extends number | null | undefined = number | null | undefined, AsComponent extends As = "input">({
    field,
    component: NumberInput2 = NumberInput,
    ...rest
}: FormNumberInputProps<FieldValue, AsComponent>): ReactNode {
    return (
        <NumberInput2<AsComponent>
            value={field.state.value ?? 0}
            onValueChange={field.handleChange as (value: number) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
