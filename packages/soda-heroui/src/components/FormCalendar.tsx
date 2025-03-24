"use client"

import { ReactNode } from "react"
import { Calendar } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"

export interface FormCalendarProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof Calendar, FieldValue>, "children"> {}

export function FormCalendar<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormCalendarProps<FieldValue>): ReactNode {
    return (
        <Calendar
            value={isNonNullable(field.state.value) ? parseTime(field.state.value) : null}
            onChange={value => field.handleChange(getTimeValue(value) as FieldValue)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
