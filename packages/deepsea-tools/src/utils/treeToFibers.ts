export type Node<T> = T & {
    children?: Node<T>[] | undefined
}

export type Fiber<T> = T & {
    parent: Fiber<T> | null
    child: Fiber<T> | null
    sibling: Fiber<T> | null
}

export function treeToFiber<T>(tree: Node<T>[]): Fiber<T> {
    if (tree.length === 0) throw new Error("树不能为空")
    let first: Fiber<T>
    function createFiber(tree: Node<T>[], parent: Fiber<T> | null): void {
        let prev: Fiber<T> | null = null
        tree.forEach(item => {
            const { children, ...others } = item
            const fiber: Fiber<T> = {
                ...(others as T),
                parent,
                child: null,
                sibling: null
            }
            first ??= fiber
            if (parent && !parent.child) parent.child = fiber
            if (prev) prev.sibling = fiber
            prev = fiber
            if (children) createFiber(children, fiber)
        })
    }
    createFiber(tree, null)
    return first!
}

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

export function walkThroughFiber<T>(fiber: Fiber<T>, callback: (fiber: Fiber<T>) => void): void {
    if (fiber.parent) throw new Error(`The fiber is not the root`)
    while (fiber) {
        callback(fiber)
        fiber = getNextFiber(fiber)!
    }
}
