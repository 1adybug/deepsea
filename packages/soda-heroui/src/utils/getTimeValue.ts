import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"
import { isNonNullable } from "deepsea-tools"

export function getTimeValue<
    T extends CalendarDateTime | ZonedDateTime | Time | CalendarDate | CalendarDateTime | ZonedDateTime | null | undefined = undefined,
>(time?: T): T extends null | undefined ? undefined : number {
    return (isNonNullable(time) ? new Date(time.toString()).valueOf() : undefined) as T extends null | undefined ? undefined : number
}
