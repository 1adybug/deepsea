"use client"

import { ComponentPropsWithoutRef, ReactNode } from "react"

import { As, MergeWithAs, Pagination, PaginationProps } from "@heroui/react"
import { Field } from "soda-tanstack-form"

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
