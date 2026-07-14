"use client"

import { type ReactNode, useContext } from "react"

import { type DateRangePickerProps, type DateValue, DateRangePicker } from "@heroui/react"
import type { Field, FieldComponentProps } from "soda-tanstack-form"
import type { StrictOmit } from "soda-type"

import { type EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import type { DateMode } from "@/utils/parseTime"
import { type RangeDefaultTime, getFieldRangeValue, getOnRangeChange } from "@/utils/range"
import type { TimeValueMode, TimeValueModeMap } from "@/utils/time"

export interface FormDateRangePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateRangePicker, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    dateMode?: DateMode
    defaultTime?: RangeDefaultTime | (() => RangeDefaultTime)
    component?: <T extends DateValue>(props: DateRangePickerProps<T>) => ReactNode
}

export function FormDateRangePicker<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined,
>({
    field: _field,
    valueMode,
    emptyValue,
    dateMode,
    defaultTime,
    component: DateRangePicker2 = DateRangePicker,
    ...rest
}: FormDateRangePickerProps<ValueMode, FieldValue>): ReactNode {
    const field = _field as unknown as Field<[Date, Date] | [number, number] | null | undefined>
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <DateRangePicker2
            value={getFieldRangeValue(field, dateMode)}
            onChange={getOnRangeChange({ field, valueMode, emptyValue, defaultTime })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
