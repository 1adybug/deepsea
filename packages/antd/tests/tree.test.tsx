import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useFilterTreeProps } from "../src/hooks/useFilterTree"

import { aclsm } from "../src/utils/aclsm"
import { getTimeRange } from "../src/utils/getTimeRange"
import { getWorkSheet } from "../src/utils/getWorkSheet"

describe("filtered tree state", () => {
    const tree = [
        {
            key: 0,
            title: "root",
            children: [
                { key: 1, title: "one" },
                { key: 2, title: "two" },
            ],
        },
    ]

    it("retains numeric zero parents and leaves the input tree unchanged", () => {
        const { result } = renderHook(() => useFilterTreeProps({ treeData: tree, filter: node => node.key === 1 }))
        expect(result.current.treeData).toEqual([{ key: 0, title: "root", children: [{ key: 1, title: "one" }] }])
        expect(tree[0].children).toHaveLength(2)
    })

    it("adds and removes selections without mutating defaults or duplicating keys", () => {
        const defaults: number[] = []

        const onSelect = vi.fn()
        const { result } = renderHook(() => useFilterTreeProps({ treeData: tree, defaultSelectedKeys: defaults, onSelect }))
        act(() => result.current.onSelect([1], { node: { key: 1 }, selected: true } as never))
        expect(result.current.selectedKeys).toEqual([1])
        expect(defaults).toEqual([])
        act(() => result.current.onSelect([1], { node: { key: 1 }, selected: true } as never))
        expect(result.current.selectedKeys).toEqual([1])
        act(() => result.current.onSelect([], { node: { key: 1 }, selected: false } as never))
        expect(result.current.selectedKeys).toEqual([])
        expect(onSelect).toHaveBeenCalledTimes(3)
    })

    it("computes checked and half-checked parent states", () => {
        const { result } = renderHook(() => useFilterTreeProps<number>({ treeData: tree, defaultCheckedKeys: [1] }))
        expect(result.current.checkedKeys).toEqual({ checked: [1], halfChecked: [0] })
        act(() => result.current.onCheck([1, 2], { node: { key: 2 }, checked: true } as never))
        expect(result.current.checkedKeys).toEqual({ checked: [1, 2, 0], halfChecked: [] })
        act(() => result.current.onCheck([], { node: { key: 0 }, checked: false } as never))
        expect(result.current.checkedKeys).toEqual({ checked: [], halfChecked: [] })
    })
})

it("converts rendered columns to worksheet cells", () => {
    expect(
        getWorkSheet<{ name: string; count: number }>({
            data: [{ name: "A", count: 2 }],
            columns: [
                { title: <strong>Name</strong>, dataIndex: "name" },
                { title: "Count", dataIndex: "count", render: value => <span>{value as number}</span> },
            ],
        }),
    ).toEqual([{ Name: "A", Count: "2" }])
})

it("combines static and computed slot classes and returns day boundaries", () => {
    const classes = aclsm<"root", boolean>({ root: "p-2 text-sm" }, active => ({ root: active ? "p-4" : null }))
    expect(classes(true)).toEqual({ root: "text-sm p-4" })
    const time = new Date(2024, 1, 29, 12).valueOf()
    const range = getTimeRange(time, time)!
    expect(range[0].hour()).toBe(0)
    expect(range[1].hour()).toBe(23)
    expect(range[1].millisecond()).toBe(999)
    expect(getTimeRange(null, time)).toBeUndefined()
})
