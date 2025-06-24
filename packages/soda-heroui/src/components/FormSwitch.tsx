"use client"

import { ReactNode } from "react"
import { Switch } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormSwitchProps<FieldValue extends boolean | null | undefined = boolean | null | undefined>
    extends StrictOmit<FieldComponentProps<typeof Switch, FieldValue>, never> {}

export function FormSwitch<FieldValue extends boolean | null | undefined = boolean | null | undefined>({
    field,
    ...rest
}: FormSwitchProps<FieldValue>): ReactNode {
    return (
        <Switch
            isSelected={field.state.value ?? false}
            onValueChange={field.handleChange as (value: boolean) => void}
            {...getFieldProps(field, true)}
            {...rest}
        />
    )
}
