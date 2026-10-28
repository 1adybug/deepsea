import { act, render, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { createEnumSelect, EnumSelect } from "../src/components/EnumSelect"
import { NiceSearch } from "../src/components/NiceSearch"
import { Theme } from "../src/components/Theme"

import { useScroll } from "../src/hooks/useScroll"

const state = vi.hoisted(() => ({ select: undefined as any, theme: undefined as any, sizes: new Map<Element, { width: number; height: number }>() }))

vi.mock("antd", async importOriginal => ({
    ...(await importOriginal<object>()),
    Select: (props: unknown) => {
        state.select = props
        return null
    },
    ConfigProvider: ({ children, theme }: any) => {
        state.theme = theme
        return children
    },
}))

vi.mock("@1adybug/hooks", async importOriginal => ({
    ...(await importOriginal<object>()),
    useSize: (target: Element | (() => Element)) => state.sizes.get(typeof target === "function" ? target() : target),
}))

describe("select controls", () => {
    it("filters enum options, drops unavailable values and honors loading", () => {
        const changed = vi.fn()
        const view = render(<EnumSelect enumObject={{ One: 1, Two: 2 }} value={2} onChange={changed} filter={option => option.value === 1} loading />)
        expect(state.select.options).toEqual([{ label: "One", value: 1 }])
        expect(changed).not.toHaveBeenCalled()
        view.rerender(<EnumSelect enumObject={{ One: 1 }} value={2} onChange={changed} />)
        expect(changed).toHaveBeenCalledWith(undefined, undefined)
        const Bound = createEnumSelect({ One: 1 })
        view.rerender(<Bound value={1} />)
        expect(state.select.value).toBe(1)
    })

    it("prunes only unavailable multi-select values and allows explicit custom values", () => {
        const changed = vi.fn()
        const view = render(<EnumSelect multiple enumObject={{ One: 1 }} value={[1, 2]} onChange={changed} />)
        expect(changed).toHaveBeenCalledWith([1], undefined)
        changed.mockClear()
        view.rerender(<EnumSelect enumObject={{ One: 1 }} value={2} allowUnavailableValue onChange={changed} />)
        expect(changed).not.toHaveBeenCalled()
    })

    it("searches labels case-insensitively and forwards the search and selection callbacks", () => {
        const searched = vi.fn(),
            changed = vi.fn()

        render(
            <NiceSearch
                data={[
                    { id: 1, label: "Alpha Beta" },
                    { id: 2, label: "Other" },
                ]}
                labelField="label"
                valueField="id"
                showSearch={{ onSearch: searched }}
                onChange={changed}
            />,
        )

        act(() => state.select.showSearch.onSearch("BETA alpha"))
        expect(state.select.options).toEqual([{ label: "Alpha Beta", value: 1 }])
        expect(searched).toHaveBeenCalledWith("BETA alpha")
        act(() => state.select.onChange(1))
        expect(changed).toHaveBeenCalledWith(1)
        expect(state.select.value).toBe(1)
    })
})

it("memoizes Theme components and scopes token props to their selected component", () => {
    const ButtonTheme = Theme.Button
    expect(Theme.Button).toBe(ButtonTheme)
    expect(Theme.Input).not.toBe(ButtonTheme)
    const view = render(<ButtonTheme colorPrimary="red">Content</ButtonTheme>)
    expect(state.theme).toEqual({ components: { Button: { colorPrimary: "red" } } })
    expect(view.container.textContent).toBe("Content")
})

it("subtracts table header, pagination and margin from available scroll space", () => {
    const container = document.createElement("div")
    container.innerHTML = '<div class="ant-table-thead"></div><div class="ant-pagination"></div>'
    state.sizes.set(container, { width: 500, height: 300 })
    state.sizes.set(container.children[0], { width: 500, height: 40 })
    state.sizes.set(container.children[1], { width: 500, height: 30 })
    expect(renderHook(() => useScroll(container, { paginationMargin: 10 })).result.current).toEqual({ x: 500, y: 220 })
})
