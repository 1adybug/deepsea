import { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date"

export interface DefaultTime {
    year?: number
    month?: number
    day?: number
    hour?: number
    minute?: number
    second?: number
    millisecond?: number
}

export function getTimeValue<T extends CalendarDateTime | ZonedDateTime | Time | CalendarDate | null | undefined = undefined>(
    time: T,
    defaultTime?: DefaultTime | (() => DefaultTime),
): T extends null | undefined ? undefined : number {
    type ReturnValue = T extends null | undefined ? undefined : number
    if (time === undefined || time === null) return undefined as ReturnValue
    const newTime = time as CalendarDateTime
    const now = new Date()
    defaultTime = typeof defaultTime === "function" ? defaultTime() : defaultTime
    const year = newTime.year ?? defaultTime?.year ?? now.getFullYear()
    const month = newTime.month ?? defaultTime?.month ?? now.getMonth() + 1
    const day = newTime.day ?? defaultTime?.day ?? now.getDate()
    const hour = newTime.hour ?? defaultTime?.hour ?? now.getHours()
    const minute = newTime.minute ?? defaultTime?.minute ?? now.getMinutes()
    const second = newTime.second ?? defaultTime?.second ?? now.getSeconds()
    const millisecond = newTime.millisecond ?? defaultTime?.millisecond ?? now.getMilliseconds()
    return new Date(`${year}/${month}/${day} ${hour}:${minute}:${second}.${millisecond}`).valueOf() as ReturnValue
}
