import { JSX } from "react"
import { Field } from "soda-tanstack-form"

import { ErrorMessage } from "@/components/ErrorMessage"

import { isFieldInvalid } from "./isFieldInvalid"

export interface FieldProps {
    onBlur: () => void
    errorMessage: JSX.Element
    isInvalid: boolean
}

export function getFieldProps(field: Field<any>): FieldProps {
    return {
        onBlur: field.handleBlur,
        errorMessage: <ErrorMessage data={field.state.meta.errors} />,
        isInvalid: isFieldInvalid(field),
    }
}
