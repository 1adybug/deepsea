import { positiveIntParser as parser } from "./positiveIntParser"

const __PARSER_MAP__: Record<string, (value: string | null | undefined) => number> = {}

/**
 * 获取正整数解析器
 * @param defaultValue 默认值
 * @returns 正整数解析器
 */
export function getPositiveIntParser(defaultValue: number = 1) {
    __PARSER_MAP__[defaultValue] ??= function positiveIntParser(value: string | null | undefined) {
        return parser(value) ?? defaultValue
    }
    return __PARSER_MAP__[defaultValue]
}
