import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"

export function getTimeValue<T extends CalendarDateTime | ZonedDateTime | Time | CalendarDate | null | undefined = undefined>(
    time?: T,
): T extends null | undefined ? undefined : number {
    type ReturnValue = T extends null | undefined ? undefined : number
    if (time === undefined || time === null) return undefined as ReturnValue
    const newTime = time as CalendarDateTime
    const now = new Date()
    const year = newTime.year ?? now.getFullYear()
    const month = newTime.month ?? now.getMonth() + 1
    const day = newTime.day ?? now.getDate()
    const hour = newTime.hour ?? now.getHours()
    const minute = newTime.minute ?? now.getMinutes()
    const second = newTime.second ?? now.getSeconds()
    const millisecond = newTime.millisecond ?? now.getMilliseconds()
    return new Date(`${year}/${month}/${day} ${hour}:${minute}:${second}.${millisecond}`).valueOf() as ReturnValue
}
