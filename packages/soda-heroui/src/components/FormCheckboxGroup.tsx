"use client"

import { ReactNode } from "react"
import { CheckboxGroup } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormCheckboxGroupProps<FieldValue extends string[] | null | undefined = string[] | null | undefined>
    extends StrictOmit<FieldComponentProps<typeof CheckboxGroup, FieldValue>, never> {}

export function FormCheckboxGroup<FieldValue extends string[] | null | undefined = string[] | null | undefined>({
    field,
    ...rest
}: FormCheckboxGroupProps<FieldValue>): ReactNode {
    return <CheckboxGroup value={field.state.value ?? []} onValueChange={field.handleChange as (value: string[]) => void} {...getFieldProps(field)} {...rest} />
}
