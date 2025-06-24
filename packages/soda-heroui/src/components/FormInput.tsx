"use client"

import { ReactNode } from "react"
import { Input } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormInputProps<FieldValue extends string | null | undefined = string | null | undefined>
    extends StrictOmit<FieldComponentProps<typeof Input, FieldValue>, never> {}

export function FormInput<FieldValue extends string | null | undefined = string | null | undefined>({ field, ...rest }: FormInputProps<FieldValue>): ReactNode {
    return <Input value={field.state.value ?? ""} onValueChange={field.handleChange as (value: string) => void} {...getFieldProps(field)} {...rest} />
}
