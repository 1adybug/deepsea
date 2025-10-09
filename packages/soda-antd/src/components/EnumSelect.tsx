import { Select } from "antd"
import { EnumOption, ValueOf, getEnumOptions } from "deepsea-tools"
import { ComponentProps, ReactNode } from "react"

export interface EnumSelectProps<T extends Record<string | number, string | number>>
    extends Omit<ComponentProps<typeof Select<ValueOf<T>, EnumOption<T>>>, "children" | "options"> {
    enumObject: T
}

export function EnumSelect<T extends Record<string | number, string | number>>({ enumObject, ...rest }: EnumSelectProps<T>): ReactNode {
    return <Select<ValueOf<T>, EnumOption<T>> options={getEnumOptions(enumObject)} {...rest} />
}

export function createEnumSelect<T extends Record<string | number, string | number>>(enumObject: T) {
    return function EnumSelect(props: Omit<EnumSelectProps<T>, "enumObject">): ReactNode {
        return <Select<ValueOf<T>, EnumOption<T>> options={getEnumOptions(enumObject)} {...props} />
    }
}
