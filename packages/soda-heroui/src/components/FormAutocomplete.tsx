"use client"

import { Key, ReactNode } from "react"
import { Autocomplete, AutocompleteProps } from "@heroui/react"
import { FieldComponentProps } from "soda-tanstack-form"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormAutocompleteProps<FieldValue extends string | null | undefined = string | null | undefined, RenderItem extends object = object>
    extends FieldComponentProps<typeof Autocomplete<RenderItem>, FieldValue> {
    component?: <T extends object>(props: AutocompleteProps<T>) => ReactNode
}

export function FormAutocomplete<FieldValue extends string | null | undefined = string | null | undefined, RenderItem extends object = object>({
    field,
    component: Autocomplete2 = Autocomplete,
    ...rest
}: FormAutocompleteProps<FieldValue, RenderItem>): ReactNode {
    return (
        <Autocomplete2<RenderItem>
            selectedKey={field.state.value ?? ""}
            onSelectionChange={field.handleChange as (value: Key | null) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
