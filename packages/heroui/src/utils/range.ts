import type { SetStateAction } from "react"

import type { Field } from "@1adybug/tanstack-form"
import { isNonNullable } from "@1adybug/tools"
import type { DateValue, RangeValue } from "@heroui/react"

import { type EmptyValue, getEmptyValue } from "@/components/FormProvider"

import { type DefaultTime, getTimeValue } from "@/utils/getTimeValue"
import { type DateMode, parseTime } from "@/utils/parseTime"
import type { TimeValueMode } from "@/utils/time"

export function getRangeValue<T extends DateMode>(value: [Date, Date] | [number, number] | null | undefined, dateMode?: T): RangeValue<DateValue> | null {
    return isNonNullable(value)
        ? {
              start: parseTime(value[0].valueOf(), dateMode),
              end: parseTime(value[1].valueOf(), dateMode),
          }
        : null
}

export function getFieldRangeValue<T extends [Date, Date] | [number, number] | null | undefined, P extends DateMode>(field: Field<T>, dateMode?: P) {
    return getRangeValue(field.state.value, dateMode)
}

export interface RangeDefaultTimeBase {
    start?: DefaultTime
    end?: DefaultTime
}

export type RangeDefaultTime = RangeDefaultTimeBase | DefaultTime

export interface GetRangeUpdaterParams {
    value: RangeValue<DateValue> | null
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
    defaultTime?: RangeDefaultTime | (() => RangeDefaultTime)
}

function isRangeDefaultTime(value: RangeDefaultTimeBase | DefaultTime): value is RangeDefaultTimeBase {
    return "start" in value || "end" in value
}

export function getRangeUpdater({
    value,
    valueMode,
    emptyValue,
    defaultTime,
}: GetRangeUpdaterParams): SetStateAction<[Date, Date] | [number, number] | null | undefined> {
    if (!isNonNullable(value)) return getEmptyValue(emptyValue)
    defaultTime = typeof defaultTime === "function" ? defaultTime() : defaultTime
    const { start, end } = isNonNullable(defaultTime) && isRangeDefaultTime(defaultTime) ? defaultTime : { start: defaultTime, end: defaultTime }
    const startTimestamp = getTimeValue(value.start, start)
    const endTimestamp = getTimeValue(value.end, end)
    if (valueMode === "timestamp") return [startTimestamp, endTimestamp]

    function updater(prev: [Date, Date] | [number, number] | null | undefined): [Date, Date] | [number, number] | null | undefined {
        return prev?.[0] instanceof Date && prev?.[1] instanceof Date && prev[0].valueOf() === startTimestamp && prev[1].valueOf() === endTimestamp
            ? prev
            : [new Date(startTimestamp), new Date(endTimestamp)]
    }

    return updater
}

export interface GetOnRangeChangeParams<T extends [Date, Date] | [number, number] | null | undefined> {
    field: Field<T>
    valueMode?: TimeValueMode
    emptyValue?: EmptyValue
    defaultTime?: RangeDefaultTime | (() => RangeDefaultTime)
}

export function getOnRangeChange<T extends [Date, Date] | [number, number] | null | undefined>({
    field,
    valueMode,
    emptyValue,
    defaultTime,
}: GetOnRangeChangeParams<T>) {
    return function onChange(value: RangeValue<DateValue> | null) {
        field.handleChange(getRangeUpdater({ value, valueMode, emptyValue, defaultTime }) as SetStateAction<T>)
    }
}
