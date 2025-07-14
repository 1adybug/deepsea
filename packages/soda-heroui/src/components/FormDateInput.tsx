"use client"

import { ReactNode, useContext } from "react"
import { DateInput, DateInputProps, DateValue } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { EmptyValue, FormContext } from "./FormProvider"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "./FormTimeInput"

export interface FormDateInputProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateInput, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    component?: <T extends DateValue>(props: DateInputProps<T>) => ReactNode
}

export function FormDateInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, component: DateInput2 = DateInput, ...rest }: FormDateInputProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return <DateInput2 value={getFieldValue(field)} onChange={getOnChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
}
