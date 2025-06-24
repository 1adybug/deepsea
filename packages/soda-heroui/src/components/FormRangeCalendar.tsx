"use client"

import { ReactNode, SetStateAction, useContext } from "react"
import { DateValue, RangeCalendar, RangeValue } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { getFieldProps } from "../utils/getFieldProps"
import { parseTime } from "../utils/parseTime"
import { EmptyValue, FormContext, getEmptyValue } from "./FormProvider"
import { TimeValueMode, TimeValueModeMap } from "./FormTimeInput"

export interface FormRangeCalendarProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | null
        | undefined,
> extends StrictOmit<FieldComponentProps<typeof RangeCalendar, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
}

export function getRangeValue(value: [Date, Date] | [number, number] | null | undefined): RangeValue<DateValue> | null {
    return isNonNullable(value)
        ? {
              start: parseTime(value[0].valueOf()),
              end: parseTime(value[1].valueOf()),
          }
        : null
}

export function getFieldRangeValue<T extends [Date, Date] | [number, number] | null | undefined>(field: Field<T>) {
    return getRangeValue(field.state.value)
}

export interface GetRangeUpdaterParams {
    value: RangeValue<DateValue> | null
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
}

export function getRangeUpdater({ value, valueMode, emptyValue }: GetRangeUpdaterParams): SetStateAction<[Date, Date] | [number, number] | null | undefined> {
    if (!isNonNullable(value)) return getEmptyValue(emptyValue)
    if (valueMode === "timestamp") return [getTimeValue(value.start), getTimeValue(value.end)]
    function updater(prev: [Date, Date] | [number, number] | null | undefined): [Date, Date] | [number, number] | null | undefined {
        return prev?.[0] instanceof Date &&
            prev?.[1] instanceof Date &&
            prev[0].valueOf() === value!.start.valueOf() &&
            prev[1].valueOf() === value!.end.valueOf()
            ? prev
            : [new Date(getTimeValue(value!.start)!), new Date(getTimeValue(value!.end)!)]
    }
    return updater
}

export interface GetOnRangeChangeParams<T extends [Date, Date] | [number, number] | null | undefined> {
    field: Field<T>
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
}

export function getOnRangeChange<T extends [Date, Date] | [number, number] | null | undefined>({ field, valueMode, emptyValue }: GetOnRangeChangeParams<T>) {
    return function onChange(value: RangeValue<DateValue> | null) {
        field.handleChange(getRangeUpdater({ value, valueMode, emptyValue }) as SetStateAction<T>)
    }
}

export function FormRangeCalendar<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | null
        | undefined,
>({ field: _field, valueMode, emptyValue, ...rest }: FormRangeCalendarProps<ValueMode, FieldValue>): ReactNode {
    const field = _field as unknown as Field<[Date, Date] | [number, number] | null | undefined>
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return <RangeCalendar value={getFieldRangeValue(field)} onChange={getOnRangeChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
}
