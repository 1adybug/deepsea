import dayjs, { ConfigType } from "dayjs"

export function formatTime(time?: ConfigType) {
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss")
}
