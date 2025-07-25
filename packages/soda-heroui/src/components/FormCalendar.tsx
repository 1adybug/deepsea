"use client"

import { Calendar, CalendarProps, DateValue } from "@heroui/react"
import { ReactNode, useContext } from "react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "@/utils/getFieldProps"
import { DateMode } from "@/utils/parseTime"

import { EmptyValue, FormContext } from "./FormProvider"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "./FormTimeInput"

export interface FormCalendarProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof Calendar, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    dateMode?: DateMode
    component?: <T extends DateValue>(props: CalendarProps<T>) => ReactNode
}

export function FormCalendar<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, dateMode, component: Calendar2 = Calendar, ...rest }: FormCalendarProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <Calendar2
            focusedValue={getFieldValue(field, dateMode)}
            onFocusChange={getOnChange({ field, valueMode, emptyValue })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
