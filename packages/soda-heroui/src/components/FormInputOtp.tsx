"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"
import { As, InputOtp, InputOtpProps, MergeWithAs } from "@heroui/react"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormInputOtpProps<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "input"> = MergeWithAs<
    ComponentPropsWithoutRef<"input">,
    ComponentPropsWithoutRef<AsComponent>,
    InputOtpProps,
    AsComponent
> & {
    field: Field<FieldValue>
}

export function FormInputOtp<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "input">({
    field,
    ...rest
}: FormInputOtpProps<FieldValue, AsComponent>): ReactNode {
    return (
        <InputOtp<AsComponent>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
