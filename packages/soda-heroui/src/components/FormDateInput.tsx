"use client"

import { ReactNode, useContext } from "react"
import { DateInput, DateInputProps, DateValue } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { EmptyValue, FormContext } from "@/components/FormProvider"

import { getFieldProps } from "@/utils/getFieldProps"
import { DefaultTime } from "@/utils/getTimeValue"
import { DateMode } from "@/utils/parseTime"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "@/utils/time"

export interface FormDateInputProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateInput, FieldValue>, never> {
    valueMode?: ValueMode
    emptyValue?: EmptyValue
    dateMode?: DateMode
    defaultTime?: DefaultTime | (() => DefaultTime)
    component?: <T extends DateValue>(props: DateInputProps<T>) => ReactNode
}

export function FormDateInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | null | undefined = TimeValueModeMap<ValueMode> | null | undefined,
>({ field, valueMode, emptyValue, dateMode, defaultTime, component: DateInput2 = DateInput, ...rest }: FormDateInputProps<ValueMode, FieldValue>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <DateInput2
            value={getFieldValue(field, dateMode)}
            onChange={getOnChange({ field, valueMode, emptyValue, defaultTime })}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
