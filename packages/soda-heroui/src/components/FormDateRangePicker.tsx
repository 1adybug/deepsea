"use client"

import { ReactNode } from "react"
import { DateRangePicker } from "@heroui/react"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { getFieldRangeValue, getOnRangeChange } from "./FormRangeCalendar"
import { TimeValueMode, TimeValueModeMap } from "./FormTimeInput"

export interface FormDateRangePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateRangePicker, FieldValue>, never> {
    valueMode?: ValueMode
}

export function FormDateRangePicker<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | undefined,
>({ field, valueMode, ...rest }: FormDateRangePickerProps<ValueMode, FieldValue>): ReactNode {
    return (
        <DateRangePicker
            value={getFieldRangeValue(field as unknown as Field<[Date, Date] | [number, number] | undefined>)}
            onChange={getOnRangeChange(field as unknown as Field<[Date, Date] | [number, number] | undefined>, valueMode)}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
