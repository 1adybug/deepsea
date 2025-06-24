"use client"

import { ReactNode, SetStateAction, useContext } from "react"
import { TimeInput } from "@heroui/react"
import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { isNonNullable } from "deepsea-tools"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "@/utils/getFieldProps"
import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { EmptyValue, FormContext, getEmptyValue } from "./FormProvider"

export type TimeValue = Date | number

export type TimeValueMode = "date" | "timestamp"

export type TimeValueModeMap<ValueMode extends TimeValueMode> = ValueMode extends "date" ? Date : ValueMode extends "timestamp" ? number : never

export interface FormTimeInputProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof TimeInput, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
}

export function getValue(value: Date | number | null | undefined) {
    return isNonNullable(value) ? parseTime(value.valueOf()) : null
}

export function getFieldValue<T extends Date | number | null | undefined>(field: Field<T>) {
    return getValue(field.state.value)
}

export interface GetUpdaterParams {
    value: CalendarDateTime | ZonedDateTime | Time | CalendarDate | CalendarDateTime | ZonedDateTime | null
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
}

export function getUpdater({ value, valueMode, emptyValue }: GetUpdaterParams): SetStateAction<Date | number | null | undefined> {
    const timestamp = getTimeValue(value)
    if (!isNonNullable(timestamp)) return getEmptyValue(emptyValue)
    if (valueMode === "timestamp") return timestamp
    return (prev: Date | number | null | undefined) => (prev instanceof Date && prev.valueOf() === timestamp ? prev : new Date(timestamp))
}

export interface GetOnChangeParams<T extends Date | number | null | undefined> {
    field: Field<T>
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
}

export function getOnChange<T extends Date | number | null | undefined>({ field, valueMode, emptyValue }: GetOnChangeParams<T>) {
    return function onChange(value: CalendarDateTime | ZonedDateTime | Time | CalendarDate | CalendarDateTime | ZonedDateTime | null) {
        field.handleChange(getUpdater({ value, valueMode, emptyValue }) as SetStateAction<T>)
    }
}

export function FormTimeInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, ...rest }: FormTimeInputProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return <TimeInput value={getFieldValue(field)} onChange={getOnChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
}
