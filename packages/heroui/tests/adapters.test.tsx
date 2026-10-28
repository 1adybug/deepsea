import type { ComponentType } from "react"

import { act, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AutoRefresh } from "../src/components/AutoRefresh"
import { createEnumSelect, createFieldEnumSelect, EnumSelect } from "../src/components/EnumSelect"
import { ErrorMessage } from "../src/components/ErrorMessage"
import { FormAutocomplete } from "../src/components/FormAutocomplete"
import { FormCalendar } from "../src/components/FormCalendar"
import { FormCheckbox } from "../src/components/FormCheckbox"
import { FormCheckboxGroup } from "../src/components/FormCheckboxGroup"
import { FormDateInput } from "../src/components/FormDateInput"
import { FormDatePicker } from "../src/components/FormDatePicker"
import { FormDateRangePicker } from "../src/components/FormDateRangePicker"
import { FormInput } from "../src/components/FormInput"
import { FormInputOtp } from "../src/components/FormInputOtp"
import { FormNumberInput } from "../src/components/FormNumberInput"
import { FormPagination } from "../src/components/FormPagination"
import { FormProvider } from "../src/components/FormProvider"
import { FormRadioGroup } from "../src/components/FormRadioGroup"
import { FormRangeCalendar } from "../src/components/FormRangeCalendar"
import { FormSelect } from "../src/components/FormSelect"
import { FormSwitch } from "../src/components/FormSwitch"
import { FormTextarea } from "../src/components/FormTextarea"
import { FormTimeInput } from "../src/components/FormTimeInput"

import { addBetterToast, closeToast } from "../src/utils/addBetterToast"
import { getFieldProps } from "../src/utils/getFieldProps"

const services = vi.hoisted(() => ({ toast: vi.fn(), refresh: undefined as (() => void) | undefined }))
vi.mock("@heroui/react", async importOriginal => ({ ...(await importOriginal<object>()), addToast: services.toast }))

vi.mock("@1adybug/hooks", async importOriginal => ({
    ...(await importOriginal<object>()),
    useAutoRefresh: (callback: () => void) => {
        services.refresh = callback
    },
}))

afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
})

type AdapterCase = [string, ComponentType<any>, string, unknown, string, unknown]

const cases: AdapterCase[] = [
    ["FormInput", FormInput, "value", "", "onValueChange", "text"],
    ["FormTextarea", FormTextarea, "value", "", "onValueChange", "text"],
    ["FormInputOtp", FormInputOtp, "value", "", "onValueChange", "123456"],
    ["FormNumberInput", FormNumberInput, "value", 0, "onValueChange", 12],
    ["FormRadioGroup", FormRadioGroup, "value", "", "onValueChange", "a"],
    ["FormCheckboxGroup", FormCheckboxGroup, "value", [], "onValueChange", ["a"]],
    ["FormCheckbox", FormCheckbox, "isSelected", false, "onValueChange", true],
    ["FormSwitch", FormSwitch, "isSelected", false, "onValueChange", true],
    ["FormPagination", FormPagination, "page", 1, "onPageChange", 2],
    ["FormAutocomplete", FormAutocomplete, "selectedKey", "", "onSelectionChange", "a"],
    ["FormDateInput", FormDateInput, "value", null, "onChange", null],
    ["FormDatePicker", FormDatePicker, "value", null, "onChange", null],
    ["FormCalendar", FormCalendar, "focusedValue", null, "onFocusChange", null],
    ["FormTimeInput", FormTimeInput, "value", null, "onChange", null],
    ["FormDateRangePicker", FormDateRangePicker, "value", null, "onChange", null],
    ["FormRangeCalendar", FormRangeCalendar, "value", null, "onChange", null],
]

describe("every field adapter", () => {
    it.each(cases)("%s: normalizes empty state, forwards changes, blur, validation and extra props", (_name, Component, valueKey, empty, changeKey, next) => {
        let captured: any

        function Capture(props: unknown) {
            captured = props
            return null
        }

        const field = { name: "field", state: { value: null, meta: { errors: [{ message: "required" }] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

        const view = render(<Component field={field} component={Capture} aria-label="adapter" />)
        expect(captured[valueKey]).toEqual(empty)
        expect(captured.isInvalid).toBe(true)
        expect(captured.name).toBe("field")
        expect(captured["aria-label"]).toBe("adapter")
        act(() => captured[changeKey](next))
        expect(field.handleChange).toHaveBeenCalledWith(next)
        captured.onBlur()
        expect(field.handleBlur).toHaveBeenCalledTimes(1)
        field.state.meta.errors = []
        view.rerender(<Component field={field} component={Capture} />)
        expect(captured.isInvalid).toBe(false)
    })
})

describe("selection and validation", () => {
    it("converts single and multiple FormSelect selections and honors empty-value context", () => {
        let captured: any

        function Capture(props: unknown) {
            captured = props
            return null
        }

        const field = { name: "choice", state: { value: null, meta: { errors: [] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

        const view = render(
            <FormProvider emptyValue="undefined">
                <FormSelect field={field} component={Capture} children={[]} />
            </FormProvider>,
        )

        act(() => captured.onSelectionChange(new Set()))
        expect(field.handleChange).toHaveBeenLastCalledWith(undefined)
        view.rerender(<FormSelect field={field} selectionMode="multiple" component={Capture} children={[]} labelPlacement="outside-top" />)
        act(() => captured.onSelectionChange(new Set(["a", "b"])))
        expect(field.handleChange).toHaveBeenLastCalledWith(["a", "b"])
        expect(captured.labelPlacement).toBe("outside-left")
    })

    it.each([
        ["EnumSelect", EnumSelect as ComponentType<any>],
        ["createEnumSelect", createEnumSelect({ Ready: "ready", Idle: "idle" }) as ComponentType<any>],
    ] as const)("%s binds enum options, selections and clearing", (_name, Component) => {
        let captured: any

        function Capture(props: unknown) {
            captured = props
            return null
        }

        const changed = vi.fn()
        render(<Component enumObject={{ Ready: "ready", Idle: "idle" }} component={Capture as never} onValueChange={changed} />)

        expect(captured.items).toEqual([
            { label: "Ready", value: "ready" },
            { label: "Idle", value: "idle" },
        ])

        act(() => captured.onSelectionChange(new Set(["ready"])))
        expect(changed).toHaveBeenLastCalledWith("ready")
        act(() => captured.onSelectionChange(new Set()))
        expect(changed).toHaveBeenLastCalledWith(null)
    })

    it("binds a field enum component's value and updates to the field", () => {
        let captured: any

        function Capture(props: unknown) {
            captured = props
            return null
        }

        const field = { name: "status", state: { value: "ready" as "ready" | "idle" | null, meta: { errors: [] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

        const Component = createFieldEnumSelect({ Ready: "ready", Idle: "idle" })
        render(<Component field={field} component={Capture as never} />)
        expect(captured.selectedKeys).toEqual(["ready"])
        act(() => captured.onSelectionChange(new Set(["idle"])))
        expect(field.handleChange).toHaveBeenCalledWith("idle")
    })

    it("deduplicates error messages and omits empty error containers", () => {
        const view = render(<ErrorMessage data={[{ message: "required" }, { message: "required" }, undefined]} />)
        expect(screen.getAllByText("required")).toHaveLength(1)
        view.rerender(<ErrorMessage data={[]} />)
        expect(view.container.childElementCount).toBe(0)

        const field = { state: { value: "", meta: { errors: [] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

        expect(getFieldProps(field, true)).not.toHaveProperty("errorMessage")
        expect(getFieldProps(field)).toHaveProperty("errorMessage")
    })
})

describe("toasts and refresh", () => {
    it("creates keyed toasts, resolves loading on close and closes by key", async () => {
        const onClose = vi.fn()
        expect(addBetterToast({ key: "fixed", loading: true, title: "Saving", onClose })).toBe("fixed")
        const options = services.toast.mock.lastCall![0]
        expect(options.classNames.closeButton).toContain("toast-fixed-close-button")
        options.onClose()
        await expect(options.promise).resolves.toBeUndefined()
        expect(onClose).toHaveBeenCalledTimes(1)
        const clicked = vi.fn()

        render(
            <button className="toast-fixed-close-button" onClick={clicked}>
                Close
            </button>,
        )

        closeToast("fixed")
        expect(clicked).toHaveBeenCalledTimes(1)
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
        closeToast("missing")
        expect(warn).toHaveBeenCalledTimes(1)
        expect(addBetterToast({ title: "Ready" })).toBeTypeOf("string")
        expect(services.toast.mock.lastCall![0]).not.toHaveProperty("promise")
    })

    it("shows an update toast with a refresh action while preserving children", () => {
        vi.stubEnv("NODE_ENV", "production")
        const refreshed = vi.fn()
        render(<AutoRefresh onRefresh={refreshed}>Content</AutoRefresh>)
        expect(screen.getByText("Content")).not.toBeNull()
        services.refresh!()
        const toast = services.toast.mock.lastCall![0]
        expect(toast.timeout).toBe(Infinity)
        const target = document.createElement("button")
        toast.endContent.props.onPress({ target })
        expect(refreshed).toHaveBeenCalledTimes(1)
    })
})
