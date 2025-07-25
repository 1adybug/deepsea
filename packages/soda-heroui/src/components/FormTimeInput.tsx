"use client"

import { ReactNode, SetStateAction, useContext } from "react"
import { TimeInput, TimeInputProps } from "@heroui/react"
import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { isNonNullable } from "deepsea-tools"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "@/utils/getFieldProps"
import { getTimeValue } from "@/utils/getTimeValue"

import { ParseMode, TimeMode, parseTime } from "../utils/parseTime"
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
    timeMode?: TimeMode
    component?: <T extends Time | CalendarDateTime | ZonedDateTime>(props: TimeInputProps<T>) => ReactNode
}

export function getValue<T extends ParseMode>(value: Date | number | null | undefined, parseMode?: T) {
    return isNonNullable(value) ? parseTime(value.valueOf(), parseMode) : null
}

export function getFieldValue<T extends Date | number | null | undefined, P extends ParseMode>(field: Field<T>, parseMode?: P) {
    return getValue(field.state.value, parseMode)
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
>({ field, valueMode, emptyValue, timeMode, component: TimeInput2 = TimeInput, ...rest }: FormTimeInputProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return <TimeInput2 value={getFieldValue(field, timeMode)} onChange={getOnChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
}
