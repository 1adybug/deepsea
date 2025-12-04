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
    component?: <AsComponent extends As = "input">(
        props: MergeWithAs<ComponentPropsWithoutRef<"input">, ComponentPropsWithoutRef<AsComponent>, InputOtpProps, AsComponent>,
    ) => ReactNode
}

export function FormInputOtp<FieldValue extends string | null | undefined = string | null | undefined, AsComponent extends As = "input">({
    field,
    component: InputOtp2 = InputOtp,
    ...rest
}: FormInputOtpProps<FieldValue, AsComponent>): ReactNode {
    return (
        <InputOtp2<AsComponent>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
