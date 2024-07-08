/** 格式化选项 */
export interface StringToNumberOption {
    /** 是否转换成小数，默认为 false */
    float?: boolean
    /** 最小值，低于最小值将会输出最小值 */
    min?: number
    /** 最大值，大于最大值将会输出最大值 */
    max?: number
    /** NaN 时输出的值 */
    default: number
}

/**
 * 将字符串转换为数字
 * @param value - 字符串
 * @param option - 转换的选项
 * @returns 数字
 */
export function stringToNumber(value: string, option?: number | StringToNumberOption) {
    const v = typeof option === "object" && option.float ? parseFloat(value) : parseInt(value)

    if (option !== undefined && option !== null) {
        if (typeof option === "number") {
            if (isNaN(v)) {
                return option
            }
            return v
        }
        if (isNaN(v)) {
            return option.default
        }
        if (option.min !== undefined && v < option.min) {
            return option.min
        }
        if (option.max !== undefined && v > option.max) {
            return option.max
        }
    }

    return v
}
