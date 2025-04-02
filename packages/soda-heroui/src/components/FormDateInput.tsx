"use client"

import { ReactNode } from "react"
import { DateInput } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"
import { TimeValueMode, TimeValueModeMap, getFieldValue, getOnChange } from "./FormTimeInput"

export interface FormDateInputProps<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
> extends StrictOmit<FieldComponentProps<typeof DateInput, FieldValue>, "children"> {
    valueMode?: ValueMode
}

export function FormDateInput<
    ValueMode extends TimeValueMode = "date",
    FieldValue extends TimeValueModeMap<ValueMode> | undefined = TimeValueModeMap<ValueMode> | undefined,
>({ field, valueMode, ...rest }: FormDateInputProps<ValueMode, FieldValue>): ReactNode {
    return (
        <DateInput
            value={getFieldValue(field)}
            onChange={getOnChange(field, valueMode)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
