import { fireEvent, render, screen } from "@testing-library/react"
import { expect, expectTypeOf, it, vi } from "vitest"

import { type Field, getFieldComponents } from "../src/utils/getFieldComponent"

it("wraps every field component, forwards unrelated props and reads fresh context", () => {
    let field: Field<string> = { name: "first", state: { value: "one", meta: { errors: [] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

    function Input({ field, label }: { field: Field<string>; label: string }) {
        return <input aria-label={label} value={field.state.value} onChange={event => field.handleChange(event.target.value)} onBlur={field.handleBlur} />
    }

    const components = getFieldComponents({ Input, Other: Input }, () => field as never)
    expectTypeOf(components.Input).parameter(0).toHaveProperty("label")
    const view = render(<components.Input label="Name" />)
    expect(screen.getByLabelText<HTMLInputElement>("Name").value).toBe("one")
    field = { ...field, state: { ...field.state, value: "two" } }
    view.rerender(<components.Other label="Other" />)
    expect(screen.getByLabelText<HTMLInputElement>("Other").value).toBe("two")
    fireEvent.blur(screen.getByLabelText("Other"))
    expect(field.handleBlur).toHaveBeenCalledTimes(1)
})
