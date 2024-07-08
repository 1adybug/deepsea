export type Node<T> = T & {
    /**
     * 子节点
     */
    children?: Node<T>[] | undefined
}

export type Fiber<T> = T & {
    /**
     * 父节点
     */
    parent: Fiber<T> | null
    /**
     * 子节点
     */
    child: Fiber<T> | null
    /**
     * 兄弟节点
     */
    sibling: Fiber<T> | null
}

/**
 * 将树转换为 fiber
 * @param tree 要转换的树
 * @returns 返回转换后的 fiber
 */
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
