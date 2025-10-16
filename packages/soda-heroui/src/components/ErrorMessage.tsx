"use client"

import { ComponentProps, FC } from "react"
import { isNonNullable } from "deepsea-tools"

export interface ErrorMessageItem {
    message: string
}

export interface ErrorMessageProps extends Omit<ComponentProps<"div">, "children"> {
    data: (ErrorMessageItem | undefined)[]
}

function getErrorMessage(error: ErrorMessageItem | string | undefined): string[] {
    if (!isNonNullable(error)) return []
    if (typeof error === "string") return [error]
    if ("errors" in error && Array.isArray(error.errors)) return error.errors.map(e => e.message).filter((item, index, array) => array.indexOf(item) === index)
    return [error.message]
}

export const ErrorMessage: FC<ErrorMessageProps> = props => {
    const { data, ...rest } = props
    const errors = data.flatMap(getErrorMessage).filter((item, index, array) => array.indexOf(item) === index)

    return (
        errors.length > 0 && (
            <div {...rest}>
                {errors.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
        )
    )
}
