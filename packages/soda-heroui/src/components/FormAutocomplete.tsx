"use client"

import { ReactNode } from "react"
import { Autocomplete } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormAutocompleteProps<FieldValue extends string | null | undefined = string | null | undefined, RenderItem extends object = object>
    extends FieldComponentProps<typeof Autocomplete<RenderItem>, FieldValue> {}

export function FormAutocomplete<FieldValue extends string | null | undefined = string | null | undefined, RenderItem extends object = object>({
    field,
    ...rest
}: FormAutocompleteProps<FieldValue, RenderItem>): ReactNode {
    return (
        <Autocomplete<RenderItem>
            value={field.state.value ?? ""}
            onValueChange={field.handleChange as (value: string) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
