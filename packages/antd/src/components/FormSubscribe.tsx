/* eslint-disable no-restricted-syntax */

import { type ComponentProps, type ReactNode, useState } from "react"

import { Form } from "antd"

const { Item: FormItem, useWatch, useFormInstance } = Form

export type FormSubscribeProps<Selector extends (values: any) => any = (values: unknown) => unknown, IsItem extends boolean = false> = {
    selector: Selector
    isItem?: IsItem
    children?: ReactNode | ((data: ReturnType<Selector>) => ReactNode)
} & (IsItem extends true ? Omit<ComponentProps<typeof FormItem<Parameters<Selector>[0]>>, "children"> : {})

export function FormSubscribe<Selector extends (values: any) => any = (values: unknown) => unknown, IsItem extends boolean = false>({
    selector,
    isItem,
    children,
    ...rest
}: FormSubscribeProps<Selector, IsItem>) {
    const form = useFormInstance<Parameters<Selector>[0]>()
    const [called, setCalled] = useState(false)

    function _selector(values: Parameters<Selector>[0]): ReturnType<Selector> {
        setCalled(true)
        return selector(values)
    }

    const data = useWatch(_selector, form)
    if (!called) return undefined
    if (typeof children === "function") children = children(data)
    if (isItem) return <FormItem {...rest}>{children}</FormItem>
    return children
}
