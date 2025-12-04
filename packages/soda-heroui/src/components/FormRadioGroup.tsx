"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"

import { As, MergeWithAs, RadioGroup, RadioGroupProps } from "@heroui/react"
import { Field } from "soda-tanstack-form"

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
