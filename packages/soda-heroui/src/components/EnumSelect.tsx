"use client"

import { ComponentProps, ReactElement, ReactNode, useCallback, useContext, useMemo } from "react"

import { Select, SelectItem, SelectProps, SharedSelection } from "@heroui/react"
import { getEnumOptions, intParser, isNonNullable, ValueOf } from "deepsea-tools"
import { useInputState } from "soda-hooks"
import { Field } from "soda-tanstack-form"

import { getFieldProps } from "@/utils/getFieldProps"

import { EmptyValue, FormContext, getEmptyValue, GetEmptyValue } from "./FormProvider"
import { SelectionMode } from "./FormSelect"

/** enumObject 的类型 */
export type SelectOptions = Record<string, string | number> | ([ReactNode, string | number] | readonly [ReactNode, string | number])[]

/** 获取枚举值的类型 */
export type EnumValue<Options extends SelectOptions> = Options extends any[] ? Options[number][1] : ValueOf<Options>

/** 获取选择器的值的类型 */
export type SelectValue<
    Options extends SelectOptions,
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
> = Mode extends "multiple" ? EnumValue<Options>[] : EnumValue<Options> | (DisallowEmptySelection extends true ? never : GetEmptyValue<Empty>)

export interface EnumOption<Options extends SelectOptions> {
    label: ReactNode
    value: EnumValue<Options>
}

export interface EnumSelectPropsBase<
    Options extends SelectOptions,
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
    Value = SelectValue<Options, Mode, DisallowEmptySelection, Empty>,
> extends Omit<
    ComponentProps<typeof Select<EnumOption<Options>>>,
    "items" | "selectionMode" | "disallowEmptySelection" | "children" | "selectedKeys" | "onSelectionChange" | "value" | "onValueChange"
> {
    enumObject?: Options
    selectionMode?: Mode
    disallowEmptySelection?: DisallowEmptySelection
    value?: Value
    onValueChange?: (value: Value) => void
    emptyValue?: Empty
    component?: <T extends object>(props: SelectProps<T>) => ReactElement
}

export interface EnumSelectProps<
    Options extends SelectOptions,
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
> extends EnumSelectPropsBase<Options, Mode, DisallowEmptySelection, Empty> {}

function render<Options extends Record<string, string | number> | ([ReactNode, string | number] | readonly [ReactNode, string | number])[]>({
    label,
    value,
}: EnumOption<Options>) {
    return <SelectItem key={value}>{label}</SelectItem>
}

export function EnumSelect<
    Options extends SelectOptions,
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
>({
    enumObject,
    selectionMode,
    value: _value,
    onValueChange,
    emptyValue,
    component: Select2 = Select,
    ...rest
}: EnumSelectProps<Options, Mode, DisallowEmptySelection, Empty>): ReactNode {
    const context = useContext(FormContext)
    emptyValue ??= context.emptyValue as Empty

    type Value = SelectValue<Options, Mode, DisallowEmptySelection, Empty>

    const [value, setValue] = useInputState(_value as Value)
    const isNumberEnum = typeof enumObject === "object" && !Array.isArray(enumObject) && typeof Object.values(enumObject).at(0) === "number"
    const selectedKeys = useMemo(() => (Array.isArray(value) ? value : isNonNullable(value) ? [value] : []).map(String), [value])

    const onSelectionChange = useCallback(
        function onSelectionChange(selection: SharedSelection) {
            const keys = Array.from(selection).map(item => (isNumberEnum ? intParser(String(item)) : String(item)) as ValueOf<Options>)
            const nextValue = (selectionMode === "multiple" ? keys : (keys.at(0) ?? getEmptyValue(emptyValue))) as Value
            setValue(nextValue)
            onValueChange?.(nextValue)
        },
        [selectionMode, onValueChange, setValue, isNumberEnum, emptyValue],
    )

    const items = useMemo(
        () =>
            (Array.isArray(enumObject)
                ? enumObject.map(([label, value]) => ({ label, value }))
                : enumObject
                  ? getEnumOptions(enumObject)
                  : []) as EnumOption<Options>[],
        [enumObject],
    )

    return (
        <Select2
            items={items}
            selectionMode={selectionMode}
            selectedKeys={isNumberEnum ? selectedKeys.map(String) : selectedKeys}
            onSelectionChange={onSelectionChange}
            {...rest}
        >
            {render}
        </Select2>
    )
}

export function createEnumSelect<Options extends SelectOptions>(enumObject?: Options): EnumSelectComponent<EnumValue<Options>> {
    return function EnumSelect2<Mode extends SelectionMode = "single", DisallowEmptySelection extends boolean = false, Empty extends EmptyValue = "null">(
        props: Omit<EnumSelectProps<Options, Mode, DisallowEmptySelection, Empty>, "enumObject">,
    ): ReactNode {
        return <EnumSelect<Options, Mode, DisallowEmptySelection, Empty> enumObject={enumObject} {...props} />
    } as EnumSelectComponent<EnumValue<Options>>
}

export type EnumSelectComponent<Value extends string | number> = <
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
>(
    props: Omit<EnumSelectProps<[ReactNode, Value][], Mode, DisallowEmptySelection, Empty>, "enumObject">,
) => ReactNode

export interface FieldEnumSelectProps<
    Options extends SelectOptions,
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
> extends Omit<EnumSelectProps<Options, Mode, DisallowEmptySelection, Empty>, "enumObject"> {
    field: Field<(Mode extends "multiple" ? EnumValue<Options>[] : EnumValue<Options>) | (DisallowEmptySelection extends true ? never : GetEmptyValue<Empty>)>
}

export type FieldEnumSelectComponent<Value extends string | number> = <
    Mode extends SelectionMode = "single",
    DisallowEmptySelection extends boolean = false,
    Empty extends EmptyValue = "null",
>(
    props: FieldEnumSelectProps<[ReactNode, Value][], Mode, DisallowEmptySelection, Empty>,
) => ReactNode

export function createFieldEnumSelect<Options extends SelectOptions>(enumObject?: Options): FieldEnumSelectComponent<EnumValue<Options>> {
    return function EnumSelect2<Mode extends SelectionMode = "single", DisallowEmptySelection extends boolean = false, Empty extends EmptyValue = "null">({
        field,
        ...rest
    }: FieldEnumSelectProps<Options, Mode, DisallowEmptySelection, Empty>): ReactNode {
        return <EnumSelect<Options, Mode, DisallowEmptySelection, Empty> enumObject={enumObject} {...getFieldProps(field)} {...rest} />
    } as unknown as FieldEnumSelectComponent<EnumValue<Options>>
}
