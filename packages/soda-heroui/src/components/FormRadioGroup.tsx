"use client"

import { ReactNode } from "react"
import { RadioGroup } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormRadioGroupProps<FieldValue extends string | undefined = string | undefined>
    extends StrictOmit<FieldComponentProps<typeof RadioGroup, FieldValue>, "children"> {}

export function FormRadioGroup<FieldValue extends string | undefined = string | undefined>({ field, ...rest }: FormRadioGroupProps<FieldValue>): ReactNode {
    return <RadioGroup value={field.state.value ?? ""} onValueChange={field.handleChange as (value: string) => void} {...getFieldProps(field)} {...rest} />
}
