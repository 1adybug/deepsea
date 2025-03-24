"use client"

import { ReactNode } from "react"
import { InputOtp } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormInputOtpProps<FieldValue extends string | undefined = string | undefined>
    extends StrictOmit<FieldComponentProps<typeof InputOtp, FieldValue>, "children"> {}

export function FormInputOtp<FieldValue extends string | undefined = string | undefined>({ field, ...rest }: FormInputOtpProps<FieldValue>): ReactNode {
    return (
        <InputOtp
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
