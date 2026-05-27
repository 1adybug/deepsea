"use client"

import { type ReactNode, useContext } from "react"

import { type CalendarProps, type DateValue, Calendar } from "@heroui/react"
import type { FieldComponentProps } from "soda-tanstack-form"
import type { StrictOmit } from "soda-type"

import { type EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import type { DefaultTime } from "@/utils/getTimeValue"
import type { DateMode } from "@/utils/parseTime"
import { type TimeValueMode, type TimeValueModeMap, getFieldValue, getOnChange } from "@/utils/time"

export interface FormCalendarProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof Calendar, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    dateMode?: DateMode
    defaultTime?: DefaultTime | (() => DefaultTime)
    component?: <T extends DateValue>(props: CalendarProps<T>) => ReactNode
}

export function FormCalendar<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, dateMode, defaultTime, component: Calendar2 = Calendar, ...rest }: FormCalendarProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <Calendar2
            focusedValue={getFieldValue(field, dateMode)}
            onFocusChange={getOnChange({ field, valueMode, emptyValue, defaultTime })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
