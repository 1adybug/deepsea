"use client"

import { ReactNode, useContext } from "react"
import { DateInput } from "@heroui/react"
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
}

export function FormDateInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, ...rest }: FormDateInputProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return <DateInput value={getFieldValue(field)} onChange={getOnChange({ field, valueMode, emptyValue })} {...getFieldProps(field)} {...rest} />
}
