"use client"

import { ReactNode, SetStateAction } from "react"
import { DateValue, RangeCalendar, RangeValue } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"
import { TimeValueMode, TimeValueModeMap } from "./FormTimeInput"

export interface FormRangeCalendarProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | undefined,
> extends StrictOmit<FieldComponentProps<typeof RangeCalendar, FieldValue>, "children"> {
    valueMode?: ValueMode
}

export function getRangeValue(value: [Date, Date] | [number, number] | undefined): RangeValue<DateValue> | null {
    return isNonNullable(value)
        ? {
              start: parseTime(value[0].valueOf()),
              end: parseTime(value[1].valueOf()),
          }
        : null
}

export function getFieldRangeValue<T extends [Date, Date] | [number, number] | undefined>(field: Field<T>) {
    return getRangeValue(field.state.value)
}

export function getRangeUpdater(value: RangeValue<DateValue> | null, valueMode?: TimeValueMode): SetStateAction<[Date, Date] | [number, number] | undefined> {
    if (!isNonNullable(value)) return undefined
    if (valueMode === "timestamp") return [getTimeValue(value.start), getTimeValue(value.end)]
    function updater(prev: [Date, Date] | [number, number] | undefined): [Date, Date] | [number, number] | undefined {
        return prev?.[0] instanceof Date &&
            prev?.[1] instanceof Date &&
            prev[0].valueOf() === value!.start.valueOf() &&
            prev[1].valueOf() === value!.end.valueOf()
            ? prev
            : [new Date(getTimeValue(value!.start)!), new Date(getTimeValue(value!.end)!)]
    }
    return updater
}

export function getOnRangeChange<T extends [Date, Date] | [number, number] | undefined>(field: Field<T>, valueMode?: TimeValueMode) {
    return function onChange(value: RangeValue<DateValue> | null) {
        field.handleChange(getRangeUpdater(value, valueMode) as SetStateAction<T>)
    }
}

export function FormRangeCalendar<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | undefined,
>({ field, valueMode, ...rest }: FormRangeCalendarProps<ValueMode, FieldValue>): ReactNode {
    return (
        <RangeCalendar
            value={getFieldRangeValue(field as unknown as Field<[Date, Date] | [number, number] | undefined>)}
            onChange={getOnRangeChange(field as unknown as Field<[Date, Date] | [number, number] | undefined>, valueMode)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
