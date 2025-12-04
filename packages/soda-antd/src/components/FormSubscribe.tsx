import { ComponentProps, ReactNode, useState } from "react"

import { useWatch } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import useFormInstance from "antd/es/form/hooks/useFormInstance"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormSubscribeProps<Selector extends (values: any) => any = (values: unknown) => unknown, IsItem extends boolean = false> = {
    selector: Selector
    isItem?: IsItem
    children?: ReactNode | ((data: ReturnType<Selector>) => ReactNode)
} & (IsItem extends true ? Omit<ComponentProps<typeof FormItem<Parameters<Selector>[0]>>, "children"> : {})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FormSubscribe<Selector extends (values: any) => any = (values: unknown) => unknown, IsItem extends boolean = false>({
    selector,
    isItem,
    children,
    ...rest
}: FormSubscribeProps<Selector, IsItem>) {
    const form = useFormInstance<Parameters<Selector>[0]>()
    const [called, setCalled] = useState(false)

    function _selector(this: unknown, ...args: Parameters<Selector>) {
        setCalled(true)
        return selector.call(this, ...args)
    }

    const data = useWatch(_selector, form)
    if (!called) return undefined
    if (typeof children === "function") children = children(data)
    if (isItem) return <FormItem {...rest}>{children}</FormItem>
    return children
}
