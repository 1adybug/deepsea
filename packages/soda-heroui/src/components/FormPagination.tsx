"use client"

import { ReactNode } from "react"
import { Pagination } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { ErrorMessage } from "./ErrorMessage"

export interface FormPaginationProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof Pagination, FieldValue>, "children"> {}

export function FormPagination<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormPaginationProps<FieldValue>): ReactNode {
    return (
        <Pagination
            page={field.state.value ?? 1}
            onChange={field.handleChange as (value: number) => void}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
