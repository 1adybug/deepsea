"use client"

import { ReactNode, SetStateAction } from "react"
import { TimeInput } from "@heroui/react"
import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { isNonNullable } from "deepsea-tools"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"

export type TimeValue = Date | number

export type TimeValueMode = "date" | "timestamp"

export type TimeValueModeMap<ValueMode extends TimeValueMode> = ValueMode extends "date" ? Date : ValueMode extends "timestamp" ? number : never

export interface FormTimeInputProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
> extends StrictOmit<FieldComponentProps<typeof TimeInput, FieldValue>, "children"> {
    valueMode?: ValueMode
}

export function getValue(value: Date | number | undefined) {
    return isNonNullable(value) ? parseTime(value.valueOf()) : null
}

export function getFieldValue<T extends Date | number | undefined>(field: Field<T>) {
    return getValue(field.state.value)
}

export function getUpdater(
    value: CalendarDateTime | ZonedDateTime | Time | CalendarDate | CalendarDateTime | ZonedDateTime | null,
    valueMode?: TimeValueMode,
): SetStateAction<Date | number | undefined> {
    const timestamp = getTimeValue(value)
    if (!isNonNullable(timestamp)) return undefined
    if (valueMode === "timestamp") return timestamp
    return (prev: Date | number | undefined) => (prev instanceof Date && prev.valueOf() === timestamp ? prev : new Date(timestamp))
}

export function getOnChange<T extends Date | number | undefined>(field: Field<T>, valueMode?: TimeValueMode) {
    return function onChange(value: CalendarDateTime | ZonedDateTime | Time | CalendarDate | CalendarDateTime | ZonedDateTime | null) {
        field.handleChange(getUpdater(value, valueMode) as SetStateAction<T>)
    }
}

export function FormTimeInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
>({ field, valueMode, ...rest }: FormTimeInputProps<ValueMode, FieldValue>): ReactNode {
    return (
        <TimeInput
            value={getFieldValue(field)}
            onChange={getOnChange(field, valueMode)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
