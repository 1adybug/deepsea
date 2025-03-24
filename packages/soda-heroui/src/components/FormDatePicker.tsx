"use client"

import { ReactNode } from "react"
import { DatePicker } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"

export interface FormDatePickerProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof DatePicker, FieldValue>, "children"> {}

export function FormDatePicker<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormDatePickerProps<FieldValue>): ReactNode {
    return (
        <DatePicker
            value={isNonNullable(field.state.value) ? parseTime(field.state.value) : null}
            onChange={value => field.handleChange(getTimeValue(value) as FieldValue)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
