"use client"

import { ReactNode } from "react"
import { NumberInput } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormNumberInputProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof NumberInput, FieldValue>, "children"> {}

export function FormNumberInput<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormNumberInputProps<FieldValue>): ReactNode {
    return <NumberInput value={field.state.value ?? 0} onValueChange={field.handleChange as (value: number) => void} {...getFieldProps(field)} {...rest} />
}
