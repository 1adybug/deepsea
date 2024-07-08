import { intParser } from "./intParser"

/** 
 * 获取整数解析器
 * @param defaultValue 默认值
 * @returns 整数解析器
 */
export function getIntParser(defaultValue: number = 0) {
    return function _intParser(value: string | null | undefined) {
        return intParser(value) ?? defaultValue
    }
}
