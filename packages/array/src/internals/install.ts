import hasOwn from "core-js-pure/es/object/has-own.js"
import iterator from "core-js-pure/es/symbol/iterator.js"
import species from "core-js-pure/es/symbol/species.js"
import unscopables from "core-js-pure/es/symbol/unscopables.js"

import { lastIndex, lastItem } from "../custom.js"

const prototype = Array.prototype as unknown as Record<PropertyKey, any>
const constructor = Array as unknown as Record<PropertyKey, any>

export function installMethod(name: string, implementation: Function, custom = false, unscopable = false) {
    const key: PropertyKey = name === "iterator" ? iterator : name
    if (custom ? !hasOwn(prototype, key) : prototype[key] !== implementation)
        Object.defineProperty(prototype, key, { value: implementation, writable: true, configurable: true, enumerable: false })

    if (unscopable) {
        if (!hasOwn(prototype, unscopables)) Object.defineProperty(prototype, unscopables, { value: Object.create(null), configurable: true })
        Object.defineProperty(prototype[unscopables], key, { value: true, writable: true, enumerable: true, configurable: true })
    }
}

export function installStatic(name: string, implementation: Function) {
    if (constructor[name] !== implementation) Object.defineProperty(constructor, name, { value: implementation, writable: true, configurable: true })
}

export function installAccessors() {
    if (!hasOwn(prototype, "lastIndex")) {
        Object.defineProperty(prototype, "lastIndex", {
            configurable: true,
            get() {
                return lastIndex(this)
            },
        })
    }

    if (!hasOwn(prototype, "lastItem")) {
        Object.defineProperty(prototype, "lastItem", {
            configurable: true,
            get() {
                return lastItem(this)
            },
            set(value) {
                lastItem(this, value)
            },
        })
    }

    for (const name of ["lastIndex", "lastItem"]) {
        if (!hasOwn(prototype, unscopables)) Object.defineProperty(prototype, unscopables, { value: Object.create(null), configurable: true })
        Object.defineProperty(prototype[unscopables], name, { value: true, writable: true, enumerable: true, configurable: true })
    }

    if (!hasOwn(constructor, species)) {
        Object.defineProperty(constructor, species, {
            configurable: true,
            get() {
                return this
            },
        })
    }
}
