import { ComponentProps, FC, JSX, JSXElementConstructor, createElement } from "react"
import { FieldApi } from "@tanstack/react-form"

export type UseFieldContext<TData> = () => FieldApi<any, string, TData, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>

export type FieldComponentProps<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, Value> = ComponentProps<T> & {
    field: ReturnType<UseFieldContext<Value>>
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
