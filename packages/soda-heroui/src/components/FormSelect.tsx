"use client"

import { ReactNode, useContext } from "react"
import { Select, SelectProps } from "@heroui/react"
import { Key } from "@react-types/shared"
import { clsx, isNonNullable } from "deepsea-tools"
import { FieldComponentProps } from "soda-tanstack-form"
import { StrictOmit } from "soda-type"

import { getFieldProps } from "../utils/getFieldProps"
import { EmptyValue, FormContext, getEmptyValue } from "./FormProvider"

export type SelectionMode = "single" | "multiple"

export type SelectLabelPlacement = "inside" | "outside" | "outside-left" | "outside-top"

export interface FormSelectProps<
    Mode extends SelectionMode = "single",
    Value extends (Mode extends "multiple" ? Key[] : Key) | null | undefined = (Mode extends "multiple" ? Key[] : Key) | null | undefined,
    RenderItem extends object = object,
> extends StrictOmit<FieldComponentProps<typeof Select<RenderItem>, Value>, "selectionMode" | "labelPlacement"> {
    labelPlacement?: SelectLabelPlacement
    selectionMode?: Mode
    emptyValue?: EmptyValue
    component?: <RenderItem extends object>(props: SelectProps<RenderItem>) => ReactNode
}

export function FormSelect<
    Mode extends SelectionMode = "single",
    Value extends (Mode extends "multiple" ? Key[] : Key) | null | undefined = (Mode extends "multiple" ? Key[] : Key) | null | undefined,
    RenderItem extends object = object,
>({
    field,
    emptyValue,
    component: Select2 = Select,
    selectionMode,
    labelPlacement,
    classNames: { base, label, ...restClassNames } = {},
    ...rest
}: FormSelectProps<Mode, Value, RenderItem>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue

    return (
        <Select2<RenderItem>
            classNames={{
                base: clsx(labelPlacement === "outside-top" && "flex flex-col", base),
                label: clsx(labelPlacement === "outside-top" && "pb-2", label),
                ...restClassNames,
            }}
            selectedKeys={isNonNullable(field.state.value) ? (selectionMode === "multiple" ? (field.state.value as Key[]) : [field.state.value as Key]) : []}
            onSelectionChange={keys => {
                const value = Array.from(keys)
                field.handleChange((selectionMode === "multiple" ? value : (value.at(0) ?? getEmptyValue(emptyValue))) as Value)
            }}
            selectionMode={selectionMode}
            labelPlacement={labelPlacement === "outside-top" ? "outside-left" : labelPlacement}
            {...getFieldProps(field)}
            {...rest}
        />
    )
}
