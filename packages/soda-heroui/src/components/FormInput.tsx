"use client"

import { ReactNode } from "react"
import { Input } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormInputProps<FieldValue extends string | undefined = string | undefined>
    extends StrictOmit<FieldComponentProps<typeof Input, FieldValue>, "children"> {}

export function FormInput<FieldValue extends string | undefined = string | undefined>({ field, ...rest }: FormInputProps<FieldValue>): ReactNode {
    return <Input value={field.state.value ?? ""} onValueChange={field.handleChange as (value: string) => void} {...getFieldProps(field)} {...rest} />
}
