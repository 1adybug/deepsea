"use client"

import { CSSProperties, ComponentProps, FC, JSX, JSXElementConstructor, ReactNode, createContext, createElement, useContext } from "react"
import { clsx } from "deepsea-tools"

export interface UnifyConfig {
    className?: string
    style?: CSSProperties
}

const UnifyConfigContext = createContext<UnifyConfig>({})

export interface UnifyConfigProviderProps extends UnifyConfig {
    children?: ReactNode
}

export const UnifyConfigProvider: FC<UnifyConfigProviderProps> = ({ className, style, children }) => {
    const { className: _className, style: _style } = useContext(UnifyConfigContext)

    return (
        <UnifyConfigContext.Provider value={{ className: clsx(_className, className), style: { ..._style, ...style } }}>{children}</UnifyConfigContext.Provider>
    )
}

export type UnifyProps<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "div"> = Omit<ComponentProps<AS>, "as"> & {
    as?: AS
}

export function Unify<AS extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = "div">(props: UnifyProps<AS>) {
    const { as = "div", className, style, ...rest } = props
    const { className: _className, style: _style } = useContext(UnifyConfigContext)

    return createElement(as, {
        className: clsx(_className, className),
        style: { ..._style, ...style },
        ...rest,
    }) as ReactNode
}
