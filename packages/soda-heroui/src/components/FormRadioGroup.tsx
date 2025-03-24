"use client"

import { ReactNode } from "react"
import { RadioGroup } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormRadioGroupProps<FieldValue extends string | undefined = string | undefined>
    extends StrictOmit<FieldComponentProps<typeof RadioGroup, FieldValue>, "children"> {}

export function FormRadioGroup<FieldValue extends string | undefined = string | undefined>({ field, ...rest }: FormRadioGroupProps<FieldValue>): ReactNode {
    return (
        <RadioGroup
            value={field.state.value ?? null}
            onValueChange={field.handleChange as (value: string) => void}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
