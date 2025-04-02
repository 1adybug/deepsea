"use client"

import { ReactNode, SetStateAction } from "react"
import { DateRangePicker, DateValue, RangeValue } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"
import { TimeValueMode, TimeValueModeMap } from "./FormTimeInput"
import { getFieldRangeValue, getOnRangeChange } from "./FormRangeCalendar"

export interface FormDateRangePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateRangePicker, FieldValue>, "children"> {
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
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
