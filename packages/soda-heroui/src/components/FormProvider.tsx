"use client"

import { assign } from "deepsea-tools"
import { FC, ReactNode, createContext, useContext } from "react"

export type EmptyValue = "null" | "undefined"

export type GetEmptyValue<T extends EmptyValue> = T extends "undefined" ? undefined : null

export function getEmptyValue<T extends EmptyValue = "null">(value?: T): GetEmptyValue<T> {
    return (value === "undefined" ? undefined : null) as GetEmptyValue<T>
}

export interface FormContext {
    /**
     * 空值设置，默认是 null
     */
    emptyValue: EmptyValue
}

export const FormContext = createContext<FormContext>({ emptyValue: "null" })

export interface FormProviderProps extends Partial<FormContext> {
    children?: ReactNode
}

export const FormProvider: FC<FormProviderProps> = ({ children, emptyValue }) => {
    const config = useContext(FormContext)
    const newConfig = assign(config, { emptyValue })

    return <FormContext value={newConfig}>{children}</FormContext>
}
