import { useMemo } from "react"

import { Fiber, Node, treeToFiber, walkThroughFiber } from "deepsea-tools"

export type SearchTreeResult<T> = {
    /** 原始树的 fiber */
    fiber: Fiber<T>
    /** 搜索后的树 */
    searchTree: Node<T>[]
    /** 自身符合条件的 fiber */
    trueFibers: Set<Fiber<T>>
    /** 最终被添加进结果的 fiber 和 node 的映射 */
    addedFiberMap: Map<Fiber<T>, Node<T>>
}

/**
 * 从树中搜索符合条件的节点
 * @param treeOrFiber 树或者 fiber
 * @param callback 回调函数，最好使用 useCallback 包裹
 * @param transform 转换函数，最好使用 useCallback 包裹
 */
export function useSearchTree<T>(treeOrFiber: Node<T>[] | Fiber<T> | null | undefined, callback: (data: T) => boolean): SearchTreeResult<T> | null
export function useSearchTree<T, K>(
    treeOrFiber: Node<T>[] | Fiber<T> | null | undefined,
    callback: (data: T) => boolean,
    transform: (data: T, isTrue: boolean, hasParentIsTrue: boolean) => K,
): SearchTreeResult<K> | null
export function useSearchTree<T, K>(
    treeOrFiber: Node<T>[] | Fiber<T> | null | undefined,
    callback: (data: T) => boolean,
    transform?: (data: T, isTrue: boolean, hasParentIsTrue: boolean) => K,
) {
    const fiber = useMemo(() => (Array.isArray(treeOrFiber) ? treeToFiber(treeOrFiber) : treeOrFiber), [treeOrFiber])

    const searchTreeResult: SearchTreeResult<T> | null = useMemo(() => {
        if (!fiber) return null

        const searchTree: Node<T>[] = []

        /** fiber 与 node 的映射 */
        const addedFiberMap: Map<Fiber<T>, Node<T>> = new Map()

        /** 自身符合条件的 fiber */
        const trueFibers: Set<Fiber<T>> = new Set()

        /** 检测是否有祖先 fiber 符合条件 */
        function parentIsTrue(fiber: Fiber<T>) {
            let parent = fiber.parent

            while (parent) {
                if (trueFibers.has(parent)) return true
                parent = parent.parent
            }

            return false
        }

        /** 添加 fiber 到树 */
        function addFiberToTree(fiber: Fiber<T>) {
            const { parent, child, sibling, ...others } = fiber
            const node = transform ? (transform(others as T, trueFibers.has(fiber), parentIsTrue(fiber)) as Node<T>) : (others as Node<T>)
            addedFiberMap.set(fiber, node)

            // 如果没有父节点，直接添加到树中
            if (!parent) return searchTree.push(node)

            // 如果父节点没有添加到树中，先添加父节点
            if (!addedFiberMap.get(parent)) addFiberToTree(parent)

            const parentNode = addedFiberMap.get(parent)!
            parentNode.children ??= []
            parentNode.children.push(node)
        }

        // 遍历 fiber
        walkThroughFiber(fiber, fiber => {
            const isTrue = callback(fiber)
            if (isTrue) trueFibers.add(fiber)
            const hasParentIsTrue = parentIsTrue(fiber)
            if (isTrue || hasParentIsTrue) addFiberToTree(fiber)
        })

        return {
            fiber,
            searchTree,
            addedFiberMap,
            trueFibers,
        }
    }, [fiber, callback, transform])

    return searchTreeResult
}
