import { fireEvent, render, screen } from "@testing-library/react"
import { expect, it, vi } from "vitest"

import { type Field, getFieldComponent } from "../src/utils/getFieldComponent"
import { isFieldInvalid } from "../src/utils/isFieldInvalid"

it("detects truthy validation errors without treating empty errors as invalid", () => {
    const field = { state: { value: "", meta: { errors: [undefined, ""] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

    expect(isFieldInvalid(field)).toBe(false)
    field.state.meta.errors.push("required")
    expect(isFieldInvalid(field)).toBe(true)
})

it("binds context fields to a component and forwards changes", () => {
    const field: Field<string> = { state: { value: "initial", meta: { errors: [] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

    function Input({ field: value }: { field: Field<string> }) {
        return <input aria-label="field" value={value.state.value} onChange={event => value.handleChange(event.target.value)} />
    }

    const Component = getFieldComponent(Input, () => field as ReturnType<Parameters<typeof getFieldComponent>[1]>)
    render(<Component />)
    fireEvent.change(screen.getByLabelText("field"), { target: { value: "changed" } })
    expect(field.handleChange).toHaveBeenCalledWith("changed")
})
