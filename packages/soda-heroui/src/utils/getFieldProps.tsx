import { JSX } from "react"

import { Field, isFieldInvalid } from "soda-tanstack-form"

import { ErrorMessage } from "@/components/ErrorMessage"

export interface FieldProps {
    onBlur: () => void
    name: string
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
                  name: field.name,
              }
            : {
                  onBlur: field.handleBlur,
                  errorMessage: <ErrorMessage data={field.state.meta.errors} />,
                  isInvalid: isFieldInvalid(field),
                  name: field.name,
              }
    ) as T extends true ? FieldPropsWithoutErrorMessage : FieldProps
}
