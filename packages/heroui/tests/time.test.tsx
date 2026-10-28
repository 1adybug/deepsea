import { useContext } from "react"

import { act, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FormContext, FormProvider, getEmptyValue } from "../src/components/FormProvider"

import { getTimeValue } from "../src/utils/getTimeValue"
import { CalendarDate, CalendarDateTime, parseTime, Time } from "../src/utils/parseTime"
import { getOnRangeChange, getRangeUpdater, getRangeValue } from "../src/utils/range"
import { getOnChange, getUpdater, getValue } from "../src/utils/time"

describe("calendar and time conversion", () => {
    const date = new Date(2024, 1, 29, 12, 34, 56, 789)

    it("round-trips local timestamps without dropping milliseconds", () => {
        const parsed = parseTime(date.valueOf())
        expect(parsed).toBeInstanceOf(CalendarDateTime)
        expect(getTimeValue(parsed)).toBe(date.valueOf())
        expect(parseTime(date.valueOf(), CalendarDate).toString()).toBe("2024-02-29")
        expect(parseTime(date.valueOf(), Time).hour).toBe(12)
        expect(getValue(null)).toBeNull()
        expect(getValue(0)).not.toBeNull()
        expect(getTimeValue(undefined)).toBeUndefined()
    })

    it("fills missing date and time fields from explicit defaults", () => {
        expect(getTimeValue(new Time(8, 30), { year: 2024, month: 2, day: 29 })).toBe(new Date(2024, 1, 29, 8, 30).valueOf())
        expect(getTimeValue(new CalendarDate(2024, 2, 29), () => ({ hour: 0, minute: 0, second: 0, millisecond: 0 }))).toBe(new Date(2024, 1, 29).valueOf())
    })

    it("returns timestamps or Date updater functions and preserves equal Date identity", () => {
        const value = parseTime(date.valueOf())
        expect(getUpdater({ value, valueMode: "timestamp" })).toBe(date.valueOf())
        const update = getUpdater({ value })
        expect(typeof update).toBe("function")
        if (typeof update !== "function") throw new Error("Expected updater")
        expect(update(date)).toBe(date)
        expect(update(null)).toEqual(date)
        expect(getUpdater({ value: null, emptyValue: "undefined" })).toBeUndefined()
        expect(getEmptyValue()).toBeNull()
    })

    it("converts ranges and retains equal Date tuple references", () => {
        const previous: [Date, Date] = [date, new Date(date.valueOf() + 1000)]

        const value = getRangeValue(previous)!
        expect(getRangeValue(null)).toBeNull()
        expect(getRangeUpdater({ value, valueMode: "timestamp" })).toEqual(previous.map(item => item.valueOf()))
        const update = getRangeUpdater({ value })
        if (typeof update !== "function") throw new Error("Expected updater")
        expect(update(previous)).toBe(previous)
        expect(update(null)).toEqual(previous)
        expect(getRangeUpdater({ value: null })).toBeNull()
    })

    it("forwards configured changes to field handlers", () => {
        const field = { handleChange: vi.fn() } as never
        getOnChange({ field, valueMode: "timestamp" })(parseTime(date.valueOf()))
        expect((field as { handleChange: ReturnType<typeof vi.fn> }).handleChange).toHaveBeenCalledWith(date.valueOf())
        getOnRangeChange({ field, emptyValue: "undefined" })(null)
        expect((field as { handleChange: ReturnType<typeof vi.fn> }).handleChange).toHaveBeenLastCalledWith(undefined)
    })
})

it("isolates nested form configuration from parents and sibling providers", () => {
    function Value({ id }: { id: string }) {
        return <span data-testid={id}>{useContext(FormContext).emptyValue}</span>
    }

    const view = render(
        <FormProvider>
            <Value id="parent" />
            <FormProvider emptyValue="undefined">
                <Value id="nested" />
            </FormProvider>
            <Value id="sibling" />
        </FormProvider>,
    )

    expect(screen.getByTestId("parent").textContent).toBe("null")
    expect(screen.getByTestId("nested").textContent).toBe("undefined")
    expect(screen.getByTestId("sibling").textContent).toBe("null")

    act(() =>
        view.rerender(
            <FormProvider>
                <Value id="parent" />
            </FormProvider>,
        ),
    )

    expect(screen.getByTestId("parent").textContent).toBe("null")
})
