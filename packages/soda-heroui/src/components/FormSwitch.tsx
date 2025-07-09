"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { As, MergeWithAs, Switch, SwitchProps } from "@heroui/react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormSwitchProps<FieldValue extends boolean | null | undefined = boolean | null | undefined, AsComponent extends As = "input"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    SwitchProps,
    AsComponent
> & {
    field: Field<FieldValue>
}

export function FormSwitch<FieldValue extends boolean | null | undefined = boolean | null | undefined, AsComponent extends As = "input">({
    field,
    ...rest
}: FormSwitchProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Switch<AsComponent>
            isSelected={field.state.value ?? false}
            onValueChange={field.handleChange as (value: boolean) => void}
            {...getFieldProps(field, true)}
            {...rest}
        />
    )
}
