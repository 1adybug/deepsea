"use client"

import { ReactNode } from "react"
import { NumberInput } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormNumberInputProps<FieldValue extends number | null | undefined = number | null | undefined>
    extends StrictOmit<FieldComponentProps<typeof NumberInput, FieldValue>, never> {}

export function FormNumberInput<FieldValue extends number | null | undefined = number | null | undefined>({
    field,
    ...rest
}: FormNumberInputProps<FieldValue>): ReactNode {
    return <NumberInput value={field.state.value ?? 0} onValueChange={field.handleChange as (value: number) => void} {...getFieldProps(field)} {...rest} />
}
