import dayjs, { ConfigType } from "dayjs"

export function formatTime(time?: ConfigType, template?: string) {
    return dayjs(time).format(template ?? "YYYY-MM-DD HH:mm:ss")
}
