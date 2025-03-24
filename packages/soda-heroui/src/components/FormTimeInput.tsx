"use client"

import { ReactNode } from "react"
import { TimeInput } from "@heroui/react"
import { isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getTimeValue } from "@/utils/getTimeValue"

import { parseTime } from "../utils/parseTime"
import { ErrorMessage } from "./ErrorMessage"

export interface FormTimeInputProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof TimeInput, FieldValue>, "children"> {}

export function FormTimeInput<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormTimeInputProps<FieldValue>): ReactNode {
    return (
        <TimeInput
            value={isNonNullable(field.state.value) ? parseTime(field.state.value) : null}
            onChange={value => field.handleChange(getTimeValue(value) as FieldValue)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
