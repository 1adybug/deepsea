import { getEnumerable } from "./getEnumerable"

export function merge<T extends {}>(a: T, b: T) {
    const result = {} as T
    const keys = new Set<keyof T>(getEnumerable(a).concat(getEnumerable(b)))

    for (const key of keys) {
        if (!Object.hasOwn(b, key)) {
            result[key] = a[key]
            continue
        }

        if (!Object.hasOwn(a, key)) {
            result[key] = b[key]
            continue
        }

        if (typeof a[key] !== "object" || a[key] === null || typeof b[key] !== "object" || b[key] === null) {
            result[key] = b[key]
            continue
        }

        result[key] = merge(a[key], b[key])
    }

    return result
}
