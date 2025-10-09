import { AnyFieldApi } from "@tanstack/react-form"
import { ComponentProps, FC, JSX, JSXElementConstructor, createElement } from "react"

export type UseFieldContext<TData> = () => AnyFieldApi

export type FieldContext<TData> = ReturnType<UseFieldContext<TData>>

export interface FieldMeta<TData> {
    errors: FieldContext<TData>["state"]["meta"]["errors"]
}

export interface FieldState<TData> {
    value: TData
    meta: FieldMeta<TData>
}

export interface Field<TData> extends Pick<FieldContext<TData>, "handleChange" | "handleBlur"> {
    name?: string
    state: FieldState<TData>
}

export type FieldComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, Value> = ComponentProps<T> & {
    field: Field<Value>
}

export function getFieldComponent<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, Value>(
    Component: JSXElementConstructor<FieldComponentProps<T, Value>>,
    useFieldContext: UseFieldContext<Value>,
) {
    const FieldComponent: FC<Omit<FieldComponentProps<T, Value>, "field">> = props => {
        const field = useFieldContext()
        return createElement(Component, { ...props, field } as FieldComponentProps<T, Value>)
    }
    return FieldComponent
}

export type FieldComponentMap<T extends Record<string, FC<FieldComponentProps<keyof JSX.IntrinsicElements | JSXElementConstructor<any>, any>>>> = {
    [Key in keyof T]: JSXElementConstructor<Omit<ComponentProps<T[Key]>, "field">>
}

export function getFieldComponents<T extends Record<string, FC<FieldComponentProps<keyof JSX.IntrinsicElements | JSXElementConstructor<any>, any>>>>(
    map: T,
    useFieldContext: UseFieldContext<any>,
) {
    return Object.fromEntries(Object.entries(map).map(([key, value]) => [key, getFieldComponent(value, useFieldContext)])) as FieldComponentMap<T>
}
