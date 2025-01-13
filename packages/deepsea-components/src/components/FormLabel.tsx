"use client"

import { ComponentPropsWithoutRef, FC, Fragment, ReactNode, createContext, useContext } from "react"

export interface FormLabelConfig {
    /**
     * Label 的宽度.
     */
    width?: number
    /**
     * 是否在 Label 前面添加一个空白区域，只有当前 Label 为非必选，而存在其他 Label 为必选的时候开启
     */
    before?: boolean | number
}

export interface FormLabelProps extends ComponentPropsWithoutRef<"div">, FormLabelConfig {}

export const FormLabelConfigContext = createContext<Partial<FormLabelConfig>>({})

export interface FormLabelConfigProviderProps extends FormLabelConfig {
    children?: ReactNode
}

export const FormLabelConfigProvider: FC<FormLabelConfigProviderProps> = ({ width, before, children }) => (
    <FormLabelConfigContext.Provider value={{ width, before }}>{children}</FormLabelConfigContext.Provider>
)

/**
 * 为 Ant Design 的 FormItem 设计的 Label 组件
 */
export const FormLabel: FC<FormLabelProps> = props => {
    const { width: _width, before: _before } = useContext(FormLabelConfigContext)
    const { style, width = _width, before = _before, ...rest } = props

    return (
        <Fragment>
            {!!before && <div style={{ width: 11, color: "transparent", userSelect: "none" }}>&ensp;</div>}
            <div style={{ width, textAlign: "justify", textAlignLast: "justify", ...style }} {...rest} />
        </Fragment>
    )
}
