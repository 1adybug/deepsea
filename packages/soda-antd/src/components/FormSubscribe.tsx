import { ComponentProps, ReactNode } from "react"
import { useWatch } from "antd/es/form/Form"
import FormItem from "antd/es/form/FormItem"
import useFormInstance from "antd/es/form/hooks/useFormInstance"

export interface FormSubscribeProps<Selector extends (values: any) => any = (values: unknown) => unknown>
    extends Omit<ComponentProps<typeof FormItem<Parameters<Selector>[0]>>, "children"> {
    selector: Selector
    children?: ReactNode | ((data: ReturnType<Selector>) => ReactNode)
}

export function FormSubscribe<Selector extends (values: any) => any = (values: unknown) => unknown>({
    selector,
    children,
    ...rest
}: FormSubscribeProps<Selector>) {
    const form = useFormInstance<Parameters<Selector>[0]>()
    const data = useWatch(selector, form)
    if (typeof children === "function") children = children(data)
    return <FormItem {...rest}>{children}</FormItem>
}
