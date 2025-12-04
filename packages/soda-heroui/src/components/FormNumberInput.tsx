"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"

import { As, MergeWithAs, NumberInput, NumberInputProps } from "@heroui/react"
import { Field } from "soda-tanstack-form"

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
