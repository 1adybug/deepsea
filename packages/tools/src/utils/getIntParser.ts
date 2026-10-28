import { intParser as parser } from "./intParser"

const __PARSER_MAP__: Record<string, (value: string | null | undefined) => number> = {}

/**
 * 获取整数解析器
 * @param defaultValue 默认值
 * @returns 整数解析器
 */
export function getIntParser(defaultValue: number = 0) {
    __PARSER_MAP__[defaultValue] ??= function intParser(value: string | null | undefined) {
        return parser(value) ?? defaultValue
    }
    return __PARSER_MAP__[defaultValue]
}
