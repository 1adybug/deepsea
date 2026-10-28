import { CalendarDate, Time } from "@internationalized/date"
import { expect, it, vi } from "vitest"

import { getFieldProps } from "../src/utils/getFieldProps"
import { getTimeValue } from "../src/utils/getTimeValue"

it("projects validation and blur behavior from the shared form field", () => {
    const field = { name: "email", state: { value: "", meta: { errors: ["required"] } }, handleChange: vi.fn(), handleBlur: vi.fn() }

    const props = getFieldProps(field, true)
    expect(props).toEqual({ name: "email", onBlur: field.handleBlur, isInvalid: true })
    props.onBlur()
    expect(field.handleBlur).toHaveBeenCalledOnce()
    expect(getFieldProps(field).errorMessage).toBeDefined()
})

it("combines partial date and time values with explicit defaults", () => {
    expect(getTimeValue(undefined)).toBeUndefined()
    const value = getTimeValue(new CalendarDate(2026, 10, 28), { hour: 0, minute: 0, second: 0, millisecond: 0 })
    expect(value).toBe(new Date(2026, 9, 28).valueOf())
    expect(getTimeValue(new Time(9, 30), { year: 2026, month: 10, day: 28, millisecond: 0 })).toBe(new Date(2026, 9, 28, 9, 30).valueOf())
})
