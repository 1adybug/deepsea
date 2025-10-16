import { Key, useMemo } from "react"
import { BasicDataNode, DataNode, EventDataNode } from "antd/es/tree"
import { StrictOmit, isNonNullable, isNullable } from "deepsea-tools"
import { useInputState } from "soda-hooks"

export interface BasicTreeDataNode<K extends Key = Key> extends BasicDataNode {
    key: K
    children?: BasicTreeDataNode<K>[]
}

export interface TreeDataNode<K extends Key = Key> extends StrictOmit<DataNode, "key" | "children"> {
    key: K
    children?: TreeDataNode<K>[]
}

export interface SelectInfo<TreeDataType extends BasicTreeDataNode> {
    event: "select"
    selected: boolean
    node: EventDataNode<TreeDataType>
    selectedNodes: TreeDataType[]
    nativeEvent: MouseEvent
}

export interface NodePosition<TreeDataType extends BasicTreeDataNode = TreeDataNode> {
    node: TreeDataType
    pos: string
}

export interface CheckInfo<TreeDataType extends BasicTreeDataNode = TreeDataNode> {
    event: "check"
    node: EventDataNode<TreeDataType>
    checked: boolean
    nativeEvent: MouseEvent
    checkedNodes: TreeDataType[]
    checkedNodesPositions?: NodePosition<TreeDataType>[]
    halfCheckedKeys?: Key[]
}

export interface UseFilterTreeParams<K extends Key = Key, T extends BasicTreeDataNode<K> | TreeDataNode<K> = TreeDataNode<K>> {
    treeData?: T[]
    filter?: (data: T) => boolean
    defaultCheckedKeys?: K[]
    checkedKeys?: K[]
    onCheck?: (checkedKeys: K[], info: CheckInfo<T>) => void
    defaultSelectedKeys?: K[]
    selectedKeys?: K[]
    onSelect?: (selectedKeys: K[], info: SelectInfo<T>) => void
}

export interface FilterTreeProps<T extends BasicTreeDataNode | TreeDataNode = TreeDataNode> {
    treeData?: T[]
    defaultCheckedKeys: undefined
    checkedKeys: Key[] | CheckedKeys | undefined
    onCheck: (checkedKeys: Key[] | CheckedKeys, info: CheckInfo<T>) => void
    checkStrictly: true
    defaultSelectedKeys: undefined
    selectedKeys: Key[] | undefined
    onSelect: (selectedKeys: Key[], info: SelectInfo<T>) => void
}

export interface CheckedKeys<K extends Key = Key> {
    checked: K[]
    halfChecked: K[]
}

const empty: never[] = []

const alwaysTrue = () => true

export function useFilterTreeProps<K extends Key = Key, T extends BasicTreeDataNode<K> | TreeDataNode<K> = TreeDataNode<K>>({
    treeData = empty,
    defaultCheckedKeys: _defaultCheckedKeys,
    checkedKeys: _checkedKeys,
    onCheck: _onCheck,
    filter = alwaysTrue,
    defaultSelectedKeys: _defaultSelectedKeys,
    selectedKeys: _selectedKeys,
    onSelect: _onSelect,
}: UseFilterTreeParams<K, T>): FilterTreeProps<T> {
    const [totalCheckedKeys, setTotalCheckedKeys] = useInputState(() => _checkedKeys ?? _defaultCheckedKeys ?? empty, [_checkedKeys])

    interface Data {
        tree: T[]
        nodeMap: Map<Key, T>
        parentMap: Map<Key, Key | undefined>
        rangeTree: T[]
        rangeNodeMap: Map<Key, T>
        added: Set<Key>
    }

    const data = useMemo<Data>(() => {
        const nodeMap = new Map<Key, T>()
        const rangeNodeMap = new Map<Key, T>()
        const parentMap = new Map<Key, Key | undefined>()
        const added = new Set<Key>()
        const rangeTree: T[] = []
        const trueNodes = new Set<Key>()

        function addNode(key: Key) {
            if (added.has(key)) return
            added.add(key)
            const node = rangeNodeMap.get(key)!
            const parentKey = parentMap.get(key)
            if (parentKey) {
                const parent = rangeNodeMap.get(parentKey)!
                parent.children ??= []
                parent.children.push(node)
                addNode(parentKey)
                return
            }
            rangeTree.push(node)
        }

        function hasParentTrue(key: Key) {
            let parentKey = parentMap.get(key)
            if (isNullable(parentKey)) return false
            if (trueNodes.has(parentKey)) return true
            return hasParentTrue(parentKey)
        }

        function runNode(node: T) {
            const { children, ...rest } = node
            nodeMap.set(node.key, node)
            rangeNodeMap.set(node.key, rest as T)
            if (filter!(node)) {
                trueNodes.add(node.key)
                addNode(node.key)
            } else if (hasParentTrue(node.key)) {
                addNode(node.key)
            }
            node.children?.forEach(item => {
                parentMap.set(item.key, node.key)
                runNode(item as T)
            })
        }

        treeData.forEach(runNode)

        return { tree: treeData, nodeMap, rangeTree, rangeNodeMap, parentMap, added }
    }, [treeData, filter])

    const rangeCheckedKeys = useMemo<CheckedKeys>(() => {
        const { rangeTree, rangeNodeMap, parentMap } = data
        const totalChecked = new Set<Key>(totalCheckedKeys)
        const rangeChecked = new Set<Key>()
        const rangeHalfChecked = new Set<Key>()

        const checkedChildrenCount = new Map<Key, number>()
        const halfCheckedChildrenCount = new Map<Key, number>()

        function runNode(node: BasicTreeDataNode, fromChild?: boolean) {
            if (fromChild || !node.children || node.children.length === 0) {
                if ((!node.children || node.children.length === 0) && totalChecked.has(node.key)) {
                    rangeChecked.add(node.key)
                }
                if (!!node.children && node.children.length > 0) {
                    const halfCheckedCount = halfCheckedChildrenCount.get(node.key) ?? 0
                    if (halfCheckedCount > 0) {
                        rangeHalfChecked.add(node.key)
                    } else {
                        const count = checkedChildrenCount.get(node.key) ?? 0
                        if (count > 0) {
                            if (count === node.children.length) rangeChecked.add(node.key)
                            else rangeHalfChecked.add(node.key)
                        }
                    }
                }
                const parentKey = parentMap.get(node.key)
                if (isNonNullable(parentKey)) {
                    if (rangeChecked.has(node.key)) {
                        const count = checkedChildrenCount.get(parentKey) ?? 0
                        checkedChildrenCount.set(parentKey, count + 1)
                    }
                    if (rangeHalfChecked.has(node.key)) {
                        const count = halfCheckedChildrenCount.get(parentKey) ?? 0
                        halfCheckedChildrenCount.set(parentKey, count + 1)
                    }
                }
                if (isNullable(parentKey)) return
                const parent = rangeNodeMap.get(parentKey)
                if (!parent) return
                if (node.key !== parent.children!.at(-1)!.key) return
                return runNode(parent, true)
            }
            node.children.forEach(item => runNode(item))
        }

        rangeTree.forEach(item => runNode(item))

        return { checked: Array.from(rangeChecked), halfChecked: Array.from(rangeHalfChecked) }
    }, [data, totalCheckedKeys])

    function onCheck(checkedKeys: CheckedKeys | Key[], info: CheckInfo<T>) {
        const { tree, rangeNodeMap, nodeMap, parentMap, added } = data

        const totalChecked = new Set<Key>(totalCheckedKeys)

        function runRangeNode(key: Key) {
            const node = nodeMap.get(key)!
            const rangeNode = rangeNodeMap.get(key)!
            if (node.children && node.children.length > 0) return rangeNode.children?.forEach(item => runRangeNode(item.key))
            if (info.checked) totalChecked.add(rangeNode.key)
            else totalChecked.delete(rangeNode.key)
        }

        runRangeNode(info.node.key)

        const checkedChildrenCount = new Map<Key, number>()

        function runNode(node: BasicTreeDataNode, fromChild?: boolean) {
            if (!added.has(node.key) || fromChild || !node.children || node.children.length === 0) {
                if (!!node.children && node.children.length > 0) {
                    if (node.children.length === checkedChildrenCount.get(node.key)) totalChecked.add(node.key)
                    else totalChecked.delete(node.key)
                }
                const parentKey = parentMap.get(node.key)
                if (isNonNullable(parentKey) && totalChecked.has(node.key)) {
                    const count = checkedChildrenCount.get(parentKey) ?? 0
                    checkedChildrenCount.set(parentKey, count + 1)
                }
                if (isNullable(parentKey)) return
                const parent = nodeMap.get(parentKey)
                if (!parent) return
                if (node.key !== parent.children!.at(-1)!.key) return
                return runNode(parent, true)
            }
            node.children.forEach(item => runNode(item))
        }

        tree.forEach(item => runNode(item))
        const newCheckedKeys = Array.from(totalChecked)
        setTotalCheckedKeys(newCheckedKeys as K[])
        _onCheck?.(newCheckedKeys as K[], info)
    }

    const [totalSelectedKeys, setTotalSelectedKeys] = useInputState(() => _selectedKeys ?? _defaultSelectedKeys ?? empty, [_selectedKeys])
    const rangeSelectedKeys = useMemo(() => totalSelectedKeys?.filter(item => data.added.has(item)) ?? [], [data, totalSelectedKeys])

    function onSelect(selectedKeys: Key[], info: SelectInfo<T>) {
        const newSelectedKeys = [...totalSelectedKeys]
        if (info.selected) totalSelectedKeys.push(info.node.key)
        else {
            const index = newSelectedKeys.indexOf(info.node.key)
            if (index !== -1) newSelectedKeys.splice(index, 1)
        }
        _onSelect?.(newSelectedKeys as K[], info)
        setTotalSelectedKeys(newSelectedKeys as K[])
    }

    return {
        treeData: data.rangeTree,
        defaultCheckedKeys: undefined,
        checkedKeys: rangeCheckedKeys as CheckedKeys<K>,
        onCheck,
        checkStrictly: true,
        defaultSelectedKeys: undefined,
        selectedKeys: rangeSelectedKeys,
        onSelect,
    }
}
