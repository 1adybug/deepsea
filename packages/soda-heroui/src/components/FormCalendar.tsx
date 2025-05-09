"use client"

import { ReactNode } from "react"
import { Calendar } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "./FormTimeInput"

export interface FormCalendarProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
> extends StrictOmit<FieldComponentProps<typeof Calendar, FieldValue>, never> {
    valueMode?: ValueMode
}

export function FormCalendar<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
>({ field, valueMode, ...rest }: FormCalendarProps<ValueMode, FieldValue>): ReactNode {
    return <Calendar value={getFieldValue(field)} onChange={getOnChange(field, valueMode)} {...getFieldProps(field)} {...rest} />
}
