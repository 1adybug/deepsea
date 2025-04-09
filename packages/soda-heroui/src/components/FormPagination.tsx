"use client"

import { ReactNode } from "react"
import { Pagination } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormPaginationProps<FieldValue extends number | undefined = number | undefined>
    extends StrictOmit<FieldComponentProps<typeof Pagination, FieldValue>, never> {}

export function FormPagination<FieldValue extends number | undefined = number | undefined>({ field, ...rest }: FormPaginationProps<FieldValue>): ReactNode {
    return <Pagination page={field.state.value ?? 1} onPageChange={field.handleChange as (value: number) => void} {...getFieldProps(field)} {...rest} />
}
