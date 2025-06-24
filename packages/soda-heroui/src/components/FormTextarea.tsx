"use client"

import { ReactNode } from "react"
import { Textarea } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormTextareaProps<FieldValue extends string | null | undefined = string | null | undefined>
    extends StrictOmit<FieldComponentProps<typeof Textarea, FieldValue>, never> {}

export function FormTextarea<FieldValue extends string | null | undefined = string | null | undefined>({
    field,
    ...rest
}: FormTextareaProps<FieldValue>): ReactNode {
    return <Textarea value={field.state.value ?? ""} onValueChange={field.handleChange as (value: string) => void} {...getFieldProps(field)} {...rest} />
}
