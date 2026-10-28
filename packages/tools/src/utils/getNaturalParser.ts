import { naturalParser as parser } from "./naturalParser"

const __PARSER_MAP__: Record<string, (value: string | null | undefined) => number> = {}

/**
 * 获取自然数解析器
 * @param defaultValue 默认值
 * @returns 自然数解析器
 */
export function getNaturalParser(defaultValue: number = 0) {
    __PARSER_MAP__[defaultValue] ??= function naturalParser(value: string | null | undefined) {
        return parser(value) ?? defaultValue
    }
    return __PARSER_MAP__[defaultValue]
}
