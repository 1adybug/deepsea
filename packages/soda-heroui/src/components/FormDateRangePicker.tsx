"use client"

import { ReactNode, useContext } from "react"
import { DateRangePicker, DateRangePickerProps, DateValue } from "@heroui/react"
import { Field, FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { EmptyValue, FormContext } from "./FormProvider"
import { getFieldRangeValue, getOnRangeChange } from "./FormRangeCalendar"
import { TimeValueMode, TimeValueModeMap } from "./FormTimeInput"

export interface FormDateRangePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | null
        | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateRangePicker, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    component?: <T extends DateValue>(props: DateRangePickerProps<T>) => ReactNode
}

export function FormDateRangePicker<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>] | null | undefined =
        | [TimeValueModeMap<ValueMode>, TimeValueModeMap<ValueMode>]
        | null
        | undefined,
>({
    field: _field,
    valueMode,
    emptyValue,
    component: DateRangePicker2 = DateRangePicker,
    ...rest
}: FormDateRangePickerProps<ValueMode, FieldValue>): ReactNode {
    const field = _field as unknown as Field<[Date, Date] | [number, number] | null | undefined>
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <DateRangePicker2 value={getFieldRangeValue(field)} onChange={getOnRangeChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
    )
}
