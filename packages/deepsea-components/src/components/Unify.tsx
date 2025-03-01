"use client"

import { CSSProperties, ComponentProps, FC, ReactNode, createContext, createElement, useContext } from "react"
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

export type UnifyProps<T extends keyof JSX.IntrinsicElements = "div"> = ComponentProps<T> & {
    as?: T
}

export function Unify<T extends keyof JSX.IntrinsicElements = "div">(props: UnifyProps<T>) {
    const { as, className, style, ...rest } = props
    const { className: _className, style: _style } = useContext(UnifyConfigContext)

    return createElement(as ?? "div", {
        className: clsx(_className, className),
        style: { ..._style, ...style },
        ...rest,
    }) as ReactNode
}
