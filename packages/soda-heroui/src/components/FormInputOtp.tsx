"use client"

import { ReactNode } from "react"
import { InputOtp } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormInputOtpProps<FieldValue extends string | undefined = string | undefined>
    extends StrictOmit<FieldComponentProps<typeof InputOtp, FieldValue>, never> {}

export function FormInputOtp<FieldValue extends string | undefined = string | undefined>({ field, ...rest }: FormInputOtpProps<FieldValue>): ReactNode {
    return <InputOtp value={field.state.value ?? ""} onValueChange={field.handleChange as (value: string) => void} {...getFieldProps(field)} {...rest} />
}
