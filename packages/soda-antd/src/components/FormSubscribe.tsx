import { ComponentProps, ReactNode } from "react"
import { useWatch } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import useFormInstance from "antd/es/form/hooks/useFormInstance"

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
    const data = useWatch(selector, form)
    if (typeof children === "function") children = children(data)
    if (isItem) return <FormItem {...rest}>{children}</FormItem>
    return children
}
