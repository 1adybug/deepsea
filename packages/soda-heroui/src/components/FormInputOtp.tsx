"use client"

/* eslint-disable no-restricted-syntax */

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type As, type InputOtpProps, type MergeWithAs, InputOtp } from "@heroui/react"
import type { Field } from "soda-tanstack-form"

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
