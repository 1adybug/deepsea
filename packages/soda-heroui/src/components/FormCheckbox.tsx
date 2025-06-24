"use client"

import { ReactNode } from "react"
import { Checkbox } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormCheckboxProps<FieldValue extends boolean | null | undefined = boolean | null | undefined>
    extends StrictOmit<FieldComponentProps<typeof Checkbox, FieldValue>, never> {}

export function FormCheckbox<FieldValue extends boolean | null | undefined = boolean | null | undefined>({
    field,
    ...rest
}: FormCheckboxProps<FieldValue>): ReactNode {
    return (
        <Checkbox
            isSelected={field.state.value ?? false}
            onValueChange={field.handleChange as (value: boolean) => void}
            {...getFieldProps(field, true)}
            {...rest}
        />
    )
}
