"use client"

import { ReactNode } from "react"
import { NumberInput } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormNumberInputProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof NumberInput, FieldValue>, "children"> {}

export function FormNumberInput<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormNumberInputProps<FieldValue>): ReactNode {
    return (
        <NumberInput
            value={field.state.value}
            onValueChange={field.handleChange as (value: number) => void}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
