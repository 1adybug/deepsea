import { postitiveIntParser } from "./postitiveIntParser"

/** 
 * 获取正整数解析器
 * @param defaultValue 默认值
 * @returns 正整数解析器
 */
export function getPostitiveIntParser(defaultValue: number = 1) {
    return function _postitiveIntParser(value: string | null | undefined) {
        return postitiveIntParser(value) ?? defaultValue
    }
}
