import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { isNonNullable } from "deepsea-tools"

export function getTimeValue(time: CalendarDateTime | ZonedDateTime | Time | null | CalendarDate | CalendarDateTime | ZonedDateTime | null) {
    return isNonNullable(time) ? new Date(time.toString()).valueOf() : undefined
}
