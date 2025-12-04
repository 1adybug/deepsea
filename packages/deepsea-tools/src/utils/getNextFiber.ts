import { Fiber } from "./treeToFibers"

/**
 * 获取下一个 fiber
 * @param fiber 当前 fiber
 * @returns 下一个 fiber
 */
export function getNextFiber<T>(fiber: Fiber<T>): Fiber<T> | null {
    if (fiber.child) return fiber.child
    if (fiber.sibling) return fiber.sibling
    let parent = fiber.parent

    while (parent) {
        if (parent.sibling) return parent.sibling
        parent = parent.parent
    }

    return null
}
