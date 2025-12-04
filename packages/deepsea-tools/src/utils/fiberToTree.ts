import { Fiber, Node } from "./treeToFibers"
import { walkThroughFiber } from "./walkThroughFiber"

/**
 * 将 fiber 转换为树
 * @param fiber 要转换的 fiber
 * @returns 返回转换后的树
 */
export function fiberToTree<T>(fiber: Fiber<T>): Node<T>[] {
    const tree: Node<T>[] = []

    /** fiber 与 node 的映射 */
    const map: Map<Fiber<T>, Node<T>> = new Map()

    walkThroughFiber(fiber, item => {
        const { parent, child, sibling, ...others } = item
        const node = others as Node<T>
        map.set(item, node)

        if (!parent) tree.push(node)
        else {
            const parentNode = map.get(parent)!
            parentNode.children ??= []
            parentNode.children.push(node)
        }
    })

    return tree
}
