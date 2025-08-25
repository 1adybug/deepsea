import { ComponentProps, ReactNode } from "react"
import { Select } from "antd"
import { EnumOption, ValueOf, getEnumOptions } from "deepsea-tools"

export interface EnumSelectProps<T extends Record<string | number, string | number>>
    extends Omit<ComponentProps<typeof Select<ValueOf<T>, EnumOption<T>>>, "children" | "options"> {
    enumObject: T
}

function EnumSelect<T extends Record<string | number, string | number>>({ enumObject, ...rest }: EnumSelectProps<T>): ReactNode {
    return <Select<ValueOf<T>, EnumOption<T>> options={getEnumOptions(enumObject)} {...rest} />
}

export default EnumSelect

// eslint-disable-next-line react-refresh/only-export-components
export function createEnumSelect<T extends Record<string | number, string | number>>(enumObject: T) {
    return function EnumSelect(props: Omit<EnumSelectProps<T>, "enumObject">): ReactNode {
        return <Select<ValueOf<T>, EnumOption<T>> options={getEnumOptions(enumObject)} {...props} />
    }
}
