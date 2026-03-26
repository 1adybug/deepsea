import dayjs, { type ConfigType } from "dayjs"

export const DEFAULT_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

let dayjsFactory = dayjs

export function setFormatTimeDayjs(nextDayjs: typeof dayjs) {
    dayjsFactory = nextDayjs
}

export function formatTime(input?: ConfigType, format: string = DEFAULT_TIME_FORMAT) {
    return dayjsFactory(input).format(format)
}
