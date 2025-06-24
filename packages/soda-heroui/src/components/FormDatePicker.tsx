"use client"

import { ReactNode, useContext } from "react"
import { DatePicker } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { EmptyValue, FormContext } from "./FormProvider"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "./FormTimeInput"

export interface FormDatePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof DatePicker, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
}

export function FormDatePicker<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, ...rest }: FormDatePickerProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return <DatePicker value={getFieldValue(field)} onChange={getOnChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
}
