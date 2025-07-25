import { isIterable } from "deepsea-tools"
import { ReactNode, isValidElement } from "react"

/**
 * 判断是否为React节点，暂时无法判断 Promise
 * @param {unknown} value 任意值
 * @returns {boolean} 是否为React节点
 */
export function isReactNode(value: unknown): value is ReactNode {
    const type = typeof value
    if (type === "string" || type === "number" || type === "boolean" || type === "undefined" || type === "bigint" || value === null) return true
    if (type === "function" || type === "symbol") return false
    if (isIterable(value)) {
        const newValue = Array.isArray(value) ? value : Array.from(value)
        return newValue.every(isReactNode)
    }
    return isValidElement(value)
}
