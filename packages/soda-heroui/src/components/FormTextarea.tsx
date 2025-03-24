"use client"

import { ReactNode } from "react"
import { Textarea } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormTextareaProps<FieldValue extends string | undefined = string | undefined>
    extends StrictOmit<FieldComponentProps<typeof Textarea, FieldValue>, "children"> {}

export function FormTextarea<FieldValue extends string | undefined = string | undefined>({ field, ...rest }: FormTextareaProps<FieldValue>): ReactNode {
    return (
        <Textarea
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
