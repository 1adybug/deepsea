import { Dayjs } from "dayjs"

export function getTimeRangeValue(value: [Dayjs, Dayjs] | undefined | null) {
    return [value?.[0]?.valueOf(), value?.[1]?.valueOf()] as const
}
