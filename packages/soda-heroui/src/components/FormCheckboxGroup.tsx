"use client"

import { ReactNode } from "react"
import { CheckboxGroup } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormCheckboxGroupProps<FieldValue extends string[] | undefined = string[] | undefined>
    extends StrictOmit<FieldComponentProps<typeof CheckboxGroup, FieldValue>, "children"> {}

export function FormCheckboxGroup<FieldValue extends string[] | undefined = string[] | undefined>({
    field,
    ...rest
}: FormCheckboxGroupProps<FieldValue>): ReactNode {
    return (
        <CheckboxGroup
            value={field.state.value ?? []}
            onValueChange={field.handleChange as (value: string[]) => void}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
