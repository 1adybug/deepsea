import dayjs from "dayjs"
import { isNullable } from "deepsea-tools"

export function getTimeRange(after: number | undefined | null, before: number | undefined | null) {
    if (isNullable(after) || isNullable(before)) return undefined
    return [dayjs(after).startOf("day"), dayjs(before).endOf("day")] as const
}
