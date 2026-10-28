"use client"

import type { Key, ReactNode } from "react"

import type { FieldComponentProps } from "@1adybug/tanstack-form"
import { type AutocompleteProps, Autocomplete } from "@heroui/react"

import { getFieldProps } from "../utils/getFieldProps"

export interface FormAutocompleteProps<
    FieldValue extends string | null | undefined = string | null | undefined,
    RenderItem extends object = object,
> extends FieldComponentProps<typeof Autocomplete<RenderItem>, FieldValue> {
    component?: <T extends object>(props: AutocompleteProps<T>) => ReactNode
}

export function FormAutocomplete<FieldValue extends string | null | undefined = string | null | undefined, RenderItem extends object = object>({
    field,
    component: Autocomplete2 = Autocomplete,
    ...rest
}: FormAutocompleteProps<FieldValue, RenderItem>): ReactNode {
    return (
        <Autocomplete2<RenderItem>
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- HeroUI 2 consumes selectedKey; value is not a compatible replacement.
            selectedKey={field.state.value ?? ""}
            // eslint-disable-next-line @typescript-eslint/no-deprecated -- Keep the HeroUI 2 selection callback contract.
            onSelectionChange={field.handleChange as (value: Key | null) => void}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
