"use client"

import { ReactNode } from "react"
import { DatePicker } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "./FormTimeInput"

export interface FormDatePickerProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
> extends StrictOmit<FieldComponentProps<typeof DatePicker, FieldValue>, "children"> {
    valueMode?: ValueMode
}

export function FormDatePicker<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
>({ field, valueMode, ...rest }: FormDatePickerProps<ValueMode, FieldValue>): ReactNode {
    return (
        <DatePicker
            value={getFieldValue(field)}
            onChange={getOnChange(field, valueMode)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
