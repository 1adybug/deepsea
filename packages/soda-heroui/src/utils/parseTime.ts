import { CalendarDate, CalendarDateTime, Time, ZonedDateTime, fromAbsolute, getLocalTimeZone } from "@internationalized/date"

export { CalendarDate, CalendarDateTime, Time, ZonedDateTime, fromAbsolute, getLocalTimeZone } from "@internationalized/date"

export type ParseMode = typeof ZonedDateTime | typeof CalendarDate | typeof CalendarDateTime | typeof Time

export type TimeMode = Exclude<ParseMode, typeof CalendarDate>

export type DateMode = Exclude<ParseMode, typeof Time>

export function parseTime<T extends ParseMode = typeof CalendarDateTime>(ms: number, type?: T): InstanceType<T> {
    if (type === ZonedDateTime) return fromAbsolute(ms, getLocalTimeZone()) as InstanceType<T>
    const date = new Date(ms)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const millisecond = date.getMilliseconds()
    if (type === CalendarDate) return new CalendarDate(year, month, day) as InstanceType<T>
    if (type === Time) return new Time(hour, minute, second, millisecond) as InstanceType<T>
    return new CalendarDateTime(year, month, day, hour, minute, second, millisecond) as InstanceType<T>
}
