import { ValueOf } from "soda-type"

import { getEnumValues } from "./getEnumValues"
import { isNullable } from "./isNullable"

const __PARSER_MAP__: Map<unknown, Map<unknown, unknown>> = new Map()

export function getEnumParser<T extends Record<string | number, string | number>, K = undefined>(
    obj: T,
    defaultValue: K = undefined as K,
): (input?: unknown) => ValueOf<T> | K {
    let innerMap = __PARSER_MAP__.get(obj)

    if (!innerMap) {
        innerMap = new Map()
        __PARSER_MAP__.set(obj, innerMap)
    }

    let parser = innerMap.get(defaultValue)

    if (!parser) {
        parser = function enumParser(input?: unknown): ValueOf<T> | K {
            if (isNullable(input)) return defaultValue

            const values = getEnumValues(obj)
            if (values.includes(input as ValueOf<T>)) return input as ValueOf<T>

            const num = Number(input)
            if (values.includes(num as ValueOf<T>)) return num as ValueOf<T>

            const str = String(input)
            if (values.includes(str as ValueOf<T>)) return str as ValueOf<T>

            return defaultValue
        }

        innerMap.set(defaultValue, parser)
    }

    return parser as (input?: unknown) => ValueOf<T> | K
}
