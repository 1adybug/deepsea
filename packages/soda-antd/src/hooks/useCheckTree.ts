import { Key, useMemo } from "react"
import { BasicDataNode, DataNode, EventDataNode } from "antd/es/tree"
import { Fiber, Node, StrictOmit, isNullable, treeToFiber, walkThroughFiber } from "deepsea-tools"
import { useInputState, useSearchTree } from "soda-hooks"

export interface BasicTreeDataNode extends BasicDataNode {
    key: Key
}

export interface TreeDataNode extends StrictOmit<DataNode, "key"> {
    key: Key
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

export interface UseCheckTreeParams<T extends BasicTreeDataNode | TreeDataNode = TreeDataNode> {
    treeData: T[]
    filter?: (data: T) => boolean
    defaultCheckedKeys?: CheckedKeys
    checkedKeys?: CheckedKeys
    onCheck?: (checkedKeys: CheckedKeys, info: CheckInfo<T>) => void
    defaultSelectedKeys?: Key[]
    selectedKeys?: Key[]
    onSelect?: (selectedKeys: Key[], info: SelectInfo<T>) => void
}

export interface CheckTreeProps<T extends BasicTreeDataNode | TreeDataNode = TreeDataNode> {
    treeData: T[]
    defaultCheckedKeys: Key[] | undefined
    checkedKeys: CheckedKeys | undefined
    onCheck: (checkedKeys: Key[] | CheckedKeys, info: CheckInfo<T>) => void
    checkStrictly: true
    defaultSelectedKeys: Key[] | undefined
    selectedKeys: Key[] | undefined
    onSelect?: (selectedKeys: Key[], info: SelectInfo<T>) => void
}

function getSelectedKeysInRange(keys: Key[] | undefined, range: Set<Key>) {
    return keys?.filter(item => range.has(item))
}

function getCheckedKeysInRange<T extends Key[] | undefined, P extends BasicTreeDataNode | TreeDataNode>(
    checkedKeys: T,
    fiber: Fiber<P> | null | undefined,
): T extends undefined ? undefined : CheckedKeys {
    type R = T extends undefined ? undefined : CheckedKeys
    if (isNullable(checkedKeys)) return undefined as R
    if (!fiber) return { checked: [], halfChecked: [] } as unknown as R
    const checked = new Set(checkedKeys)
    const newChecked = new Set<Key>()
    const newHalfChecked = new Set<Key>()

    function check(fiber: Fiber<P>) {
        newHalfChecked.delete(fiber.key)
        newChecked.add(fiber.key)
        if (!fiber.parent) return
        let parent = fiber.parent as Fiber<P> | null
        while (parent) {
            newHalfChecked.add(parent.key)
            parent = parent.parent
        }
        let child = fiber.parent.child
        let parentChecked = true
        while (child) {
            if (!newChecked.has(child.key)) {
                parentChecked = false
                break
            }
            child = child.sibling
        }
        if (parentChecked) check(fiber.parent)
        else newHalfChecked.add(fiber.parent.key)
    }

    walkThroughFiber(fiber, item => {
        if (!checked.has(item.key) || !!item.child) return
        check(item)
    })

    return {
        checked: Array.from(newChecked),
        halfChecked: Array.from(newHalfChecked),
    } as R
}

export interface CheckedKeys {
    checked: Key[]
    halfChecked: Key[]
}

export function useCheckTreeProps<T extends BasicTreeDataNode | TreeDataNode = TreeDataNode>({
    treeData,
    defaultCheckedKeys: _defaultCheckedKeys,
    checkedKeys: _checkedKeys,
    onCheck: _onCheck,
    filter: _filter,
    defaultSelectedKeys: _defaultSelectedKeys,
    selectedKeys: _selectedKeys,
    onSelect: _onSelect,
}: UseCheckTreeParams<T>): CheckTreeProps<T> {
    const [__checkedKeys, setCheckedKeys] = useInputState(() => _checkedKeys ?? _defaultCheckedKeys, [_checkedKeys])
    const filter = useMemo(() => _filter ?? (() => true), [_filter])
    const searchResult = useSearchTree(treeData! as Node<T>[], filter)
    const searchFiber = useMemo(() => treeToFiber(searchResult?.searchTree ?? []), [searchResult?.searchTree])
    const range = useMemo(() => new Set(Array.from(searchResult?.addedFiberMap.keys() ?? []).map(item => item.key)), [searchResult?.addedFiberMap])
    const checkedKeys = useMemo(() => getCheckedKeysInRange(__checkedKeys?.checked, searchFiber), [__checkedKeys, searchFiber])

    function onCheck(checkedKeys: CheckedKeys | Key[], info: CheckInfo<T>) {
        const keys = new Set<Key>()

        function getKeys(nodes: Node<T>[]) {
            nodes.forEach(({ key, children }) => {
                keys.add(key)
                if (children) getKeys(children)
            })
        }

        getKeys([info.node as Node<T>])

        let newChecked = new Set(__checkedKeys?.checked ?? [])

        if (info.checked) newChecked = newChecked.union(keys)
        else newChecked = newChecked.difference(keys)

        const newCheckedKeys = getCheckedKeysInRange(Array.from(newChecked), searchResult?.fiber)

        _onCheck?.(newCheckedKeys, info)
        setCheckedKeys(newCheckedKeys)
    }

    const defaultSelectedKeys = getSelectedKeysInRange(_defaultSelectedKeys, range)
    const selectedKeys = getSelectedKeysInRange(_selectedKeys, range)

    const onSelect: NonNullable<typeof _onSelect> = (selectedKeys, info) => {
        selectedKeys = getSelectedKeysInRange(selectedKeys, range) ?? []
        _onSelect?.(selectedKeys, info)
    }

    return {
        treeData: searchResult?.searchTree ?? [],
        defaultCheckedKeys: undefined,
        checkedKeys,
        onCheck,
        checkStrictly: true,
        defaultSelectedKeys,
        selectedKeys,
        onSelect,
    }
}
