import { ZonedDateTime, fromAbsolute, getLocalTimeZone } from "@internationalized/date"

export function parseTime(ms: number): ZonedDateTime {
    return fromAbsolute(ms, getLocalTimeZone())
}
