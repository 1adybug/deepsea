import { getNextFiber } from "./getNextFiber"
import { Fiber } from "./treeToFibers"

/** 
 * 遍历 fiber
 * @param fiber 要遍历的 fiber
 * @param callback 回调函数
 * @returns 无
 */
export function walkThroughFiber<T>(fiber: Fiber<T>, callback: (fiber: Fiber<T>) => void): void {
    if (fiber.parent) throw new Error(`The fiber is not the root`)
    while (fiber) {
        callback(fiber)
        fiber = getNextFiber(fiber)!
    }
}
