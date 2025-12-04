"use client"

import { ReactNode, useContext } from "react"

import { TimeInput, TimeInputProps } from "@heroui/react"
import { CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import { DefaultTime } from "@/utils/getTimeValue"
import { TimeMode } from "@/utils/parseTime"
import { getFieldValue, getOnChange, TimeValueMode, TimeValueModeMap } from "@/utils/time"

export interface FormTimeInputProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof TimeInput, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    timeMode?: TimeMode
    defaultTime?: DefaultTime | (() => DefaultTime)
    component?: <T extends Time | CalendarDateTime | ZonedDateTime>(props: TimeInputProps<T>) => ReactNode
}

export function FormTimeInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, timeMode, defaultTime, component: TimeInput2 = TimeInput, ...rest }: FormTimeInputProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <TimeInput2
            value={getFieldValue(field, timeMode)}
            onChange={getOnChange({ field, valueMode, emptyValue, defaultTime })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
