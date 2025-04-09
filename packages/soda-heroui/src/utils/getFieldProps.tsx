import { JSX } from "react"
import { Field } from "soda-tanstack-form"

import { ErrorMessage } from "@/components/ErrorMessage"

import { isFieldInvalid } from "./isFieldInvalid"

export interface FieldProps {
    onBlur: () => void
    errorMessage: JSX.Element
    isInvalid: boolean
}

export type FieldPropsWithoutErrorMessage = Omit<FieldProps, "errorMessage">

export function getFieldProps<T extends boolean = false>(field: Field<any>, noErrorMessage?: T): T extends true ? FieldPropsWithoutErrorMessage : FieldProps {
    return (
        noErrorMessage
            ? {
                  onBlur: field.handleBlur,
                  isInvalid: isFieldInvalid(field),
              }
            : {
                  onBlur: field.handleBlur,
                  errorMessage: <ErrorMessage data={field.state.meta.errors} />,
                  isInvalid: isFieldInvalid(field),
              }
    ) as T extends true ? FieldPropsWithoutErrorMessage : FieldProps
}
