"use client"

import { ReactNode } from "react"
import { DateRangePicker } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"

export interface FormDateRangePickerProps<FieldValue extends [number, number] | undefined = [number, number] | undefined>
    extends StrictOmit<FieldComponentProps<typeof DateRangePicker, FieldValue>, "children"> {}

export function FormDateRangePicker<FieldValue extends [number, number] | undefined = [number, number] | undefined>({
    field,
    ...rest
}: FormDateRangePickerProps<FieldValue>): ReactNode {
    return (
        <DateRangePicker
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
