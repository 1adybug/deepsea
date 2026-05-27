"use client"

/* eslint-disable no-restricted-syntax */

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type As, type MergeWithAs, type PaginationProps, Pagination } from "@heroui/react"
import type { Field } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export type FormPaginationProps<FieldValue extends number | null | undefined = number | null | undefined, AsComponent extends As = "nav"> = MergeWithAs<
    ComponentPropsWithoutRef<"nav">,
    ComponentPropsWithoutRef<AsComponent>,
    PaginationProps,
    AsComponent
> & {
    field: Field<FieldValue>
    component?: <AsComponent extends As = "nav">(
        props: MergeWithAs<ComponentPropsWithoutRef<"nav">, ComponentPropsWithoutRef<AsComponent>, PaginationProps, AsComponent>,
    ) => ReactNode
}

export function FormPagination<FieldValue extends number | null | undefined = number | null | undefined, AsComponent extends As = "nav">({
    field,
    component: Pagination2 = Pagination,
    ...rest
}: FormPaginationProps<FieldValue, AsComponent>): ReactNode {
    return (
        <Pagination2<AsComponent>
            page={field.state.value ?? 1}
            onPageChange={field.handleChange as (value: number) => void as any}
            {...getFieldProps(field, true)}
            {...rest}
        />
    )
}
