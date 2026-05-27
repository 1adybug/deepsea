"use client"

import { type ReactNode, useContext } from "react"

import { type TimeInputProps, TimeInput } from "@heroui/react"
import type { CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import type { FieldComponentProps } from "soda-tanstack-form"
import type { StrictOmit } from "soda-type"

import { type EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import type { DefaultTime } from "@/utils/getTimeValue"
import type { TimeMode } from "@/utils/parseTime"
import { type TimeValueMode, type TimeValueModeMap, getFieldValue, getOnChange } from "@/utils/time"

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
