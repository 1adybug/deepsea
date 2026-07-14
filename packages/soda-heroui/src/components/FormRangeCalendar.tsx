"use client"

import { type ReactNode, useContext } from "react"

import { type DateValue, type RangeCalendarProps, RangeCalendar } from "@heroui/react"
import type { Field, FieldComponentProps } from "soda-tanstack-form"
import type { StrictOmit } from "soda-type"

import { type EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import type { DateMode } from "@/utils/parseTime"
import { type RangeDefaultTime, getFieldRangeValue, getOnRangeChange } from "@/utils/range"
import type { TimeValueMode, TimeValueModeMap } from "@/utils/time"

export interface FormRangeCalendarProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof RangeCalendar, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    dateMode?: DateMode
    defaultTime?: RangeDefaultTime | (() => RangeDefaultTime)
    component?: <T extends DateValue>(props: RangeCalendarProps<T>) => ReactNode
}

export function FormRangeCalendar<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined,
>({
    field: _field,
    valueMode,
    emptyValue,
    dateMode,
    defaultTime,
    component: RangeCalendar2 = RangeCalendar,
    ...rest
}: FormRangeCalendarProps<ValueMode, FieldValue>): ReactNode {
    const field = _field as unknown as Field<[Date, Date] | [number, number] | null | undefined>
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <RangeCalendar2
            value={getFieldRangeValue(field, dateMode)}
            onChange={getOnRangeChange({ field, valueMode, emptyValue, defaultTime })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
