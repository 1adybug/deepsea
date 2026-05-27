"use client"

import { type ReactNode, useContext } from "react"

import { type DatePickerProps, type DateValue, DatePicker } from "@heroui/react"
import type { FieldComponentProps } from "soda-tanstack-form"
import type { StrictOmit } from "soda-type"

import { type EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import type { DefaultTime } from "@/utils/getTimeValue"
import type { DateMode } from "@/utils/parseTime"
import { type TimeValueMode, type TimeValueModeMap, getFieldValue, getOnChange } from "@/utils/time"

export interface FormDatePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof DatePicker, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    dateMode?: DateMode
    defaultTime?: DefaultTime | (() => DefaultTime)
    component?: <T extends DateValue>(props: DatePickerProps<T>) => ReactNode
}

export function FormDatePicker<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({
    field,
    valueMode,
    emptyValue,
    dateMode,
    defaultTime,
    component: DatePicker2 = DatePicker,
    ...rest
}: FormDatePickerProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <DatePicker2
            value={getFieldValue(field, dateMode)}
            onChange={getOnChange({ field, valueMode, emptyValue, defaultTime })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
