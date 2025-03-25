"use client"

import { ReactNode } from "react"
import { Autocomplete } from "@heroui/react"
import { Key } from "@react-types/shared"
import { FieldComponentProps } from "soda-tanstack-form"

import { ErrorMessage } from "./ErrorMessage"

export interface FormAutocompleteProps<FieldValue extends Key | undefined = Key | undefined, RenderItem extends object = object>
    extends FieldComponentProps<typeof Autocomplete<RenderItem>, FieldValue> {}

export function FormAutocomplete<FieldValue extends Key | undefined = Key | undefined, RenderItem extends object = object>({
    field,
    ...rest
}: FormAutocompleteProps<FieldValue, RenderItem>): ReactNode {
    return (
        <Autocomplete<RenderItem>
            selectedKey={field.state.value ?? null}
            onSelectionChange={value => field.handleChange((value ?? undefined) as FieldValue)}
            onBlur={field.handleBlur}
            errorMessage={<ErrorMessage data={field.state.meta.errors} />}
            isInvalid={field.state.meta.errors.some(Boolean)}
            {...rest}
        />
    )
}
