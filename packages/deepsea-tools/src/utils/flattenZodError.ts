import { z } from "zod"
import { $ZodError } from "zod/v4/core"

export interface FlattenZodErrorParams<WithPath extends boolean = false, IsUnique extends boolean = true> {
    error: $ZodError
    withPath?: WithPath
    isUnique?: IsUnique
}

export interface FlattenZodErrorResultWithPath<IsUnique extends boolean = true> {
    message: string
    path: IsUnique extends true ? string[] : string
}

export type FlattenZodErrorResult<WithPath extends boolean = false, IsUnique extends boolean = true> = WithPath extends true
    ? FlattenZodErrorResultWithPath<IsUnique>
    : string[]

function isZodError(errorOrParams: $ZodError | FlattenZodErrorParams<boolean, boolean>): errorOrParams is $ZodError {
    return errorOrParams instanceof Error
}

export function flattenZodError(error: $ZodError): string[]
export function flattenZodError<WithPath extends boolean = false, IsUnique extends boolean = true>(
    params: FlattenZodErrorParams<WithPath, IsUnique>,
): FlattenZodErrorResult<WithPath, IsUnique>[]

export function flattenZodError(errorOrParams: $ZodError | FlattenZodErrorParams<boolean, boolean>): FlattenZodErrorResult<boolean, boolean>[] | string[] {
    const { error, withPath, isUnique = true } = isZodError(errorOrParams) ? { error: errorOrParams } : errorOrParams

    const errors = z
        .prettifyError(error)
        .replace(/^✖ /, "")
        .split("\n✖ ")
        .map<FlattenZodErrorResultWithPath<false>>(item => {
            const match = item.match(/^(.+)\n {2}→ at (.+)$/)
            if (match) return { message: match[1], path: match[2] }
            return { message: item, path: "" }
        })

    if (withPath && !isUnique) return errors
    if (!withPath && !isUnique) return errors.map(item => item.message)

    const uniqueErrors = errors.reduce((acc: FlattenZodErrorResultWithPath<true>[], item) => {
        const index = acc.findIndex(i => i.message === item.message)

        if (index >= 0) acc[index].path.push(item.path)
        else acc.push({ message: item.message, path: [item.path] })

        return acc
    }, [])

    if (withPath) return uniqueErrors
    return uniqueErrors.map(item => item.message)
}
