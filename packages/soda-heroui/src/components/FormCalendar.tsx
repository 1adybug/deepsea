"use client"

import { ReactNode, useContext } from "react"
import { Calendar, CalendarProps, DateValue } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import { DefaultTime } from "@/utils/getTimeValue"
import { DateMode } from "@/utils/parseTime"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "@/utils/time"

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
