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
}

export function FormNumberInput<FieldValue extends number | null | undefined = number | null | undefined, AsComponent extends As = "input">({
    field,
    ...rest
}: FormNumberInputProps<FieldValue, AsComponent>): ReactNode {
    return (
        <NumberInput<AsComponent>
            value={field.state.value ?? 0}
            onValueChange={field.handleChange as (value: number) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
