import { positiveIntParser } from "./positiveIntParser"

/** 
 * 获取正整数解析器
 * @param defaultValue 默认值
 * @returns 正整数解析器
 */
export function getPositiveIntParser(defaultValue: number = 1) {
    return function _positiveIntParser(value: string | null | undefined) {
        return positiveIntParser(value) ?? defaultValue
    }
}
