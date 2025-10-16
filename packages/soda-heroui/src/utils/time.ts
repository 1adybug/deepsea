import { SetStateAction } from "react"
import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { isNonNullable } from "deepsea-tools"
import { Field } from "soda-tanstack-form"

import { EmptyValue, getEmptyValue } from "@/components/FormProvider"

import { DefaultTime, getTimeValue } from "@/utils/getTimeValue"
import { ParseMode, parseTime } from "@/utils/parseTime"

export type TimeValue = Date | number

export type TimeValueMode = "date" | "timestamp"

export type TimeValueModeMap<ValueMode extends TimeValueMode> = ValueMode extends "date" ? Date : ValueMode extends "timestamp" ? number : never

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
    defaultTime?: DefaultTime | (() => DefaultTime)
}

export function getUpdater({ value, valueMode, emptyValue, defaultTime }: GetUpdaterParams): SetStateAction<Date | number | null | undefined> {
    const timestamp = getTimeValue(value, defaultTime)
    if (!isNonNullable(timestamp)) return getEmptyValue(emptyValue)
    if (valueMode === "timestamp") return timestamp
    return (prev: Date | number | null | undefined) => (prev instanceof Date && prev.valueOf() === timestamp ? prev : new Date(timestamp))
}

export interface GetOnChangeParams<T extends Date | number | null | undefined> {
    field: Field<T>
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
    defaultTime?: DefaultTime | (() => DefaultTime)
}

export function getOnChange<T extends Date | number | null | undefined>({ field, valueMode, emptyValue, defaultTime }: GetOnChangeParams<T>) {
    return function onChange(value: CalendarDateTime | ZonedDateTime | Time | CalendarDate | CalendarDateTime | ZonedDateTime | null) {
        field.handleChange(getUpdater({ value, valueMode, emptyValue, defaultTime }) as SetStateAction<T>)
    }
}
