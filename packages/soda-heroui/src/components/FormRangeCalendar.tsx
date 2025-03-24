"use client"

import { ReactNode } from "react"
import { RangeCalendar } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"

export interface FormRangeCalendarProps<FieldValue extends [number, number] | undefined = [number, number] | undefined>
    extends StrictOmit<FieldComponentProps<typeof RangeCalendar, FieldValue>, "children"> {}

export function FormRangeCalendar<FieldValue extends [number, number] | undefined = [number, number] | undefined>({
    field,
    ...rest
}: FormRangeCalendarProps<FieldValue>): ReactNode {
    return (
        <RangeCalendar
            value={
                isNonNullable(field.state.value)
                    ? {
                          start: parseTime(field.state.value[0]),
                          end: parseTime(field.state.value[1]),
                      }
                    : null
            }
            onChange={value => field.handleChange((isNonNullable(value) ? [getTimeValue(value.start), getTimeValue(value.end)] : undefined) as FieldValue)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
