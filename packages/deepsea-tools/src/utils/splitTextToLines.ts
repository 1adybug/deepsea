import { isFullWidthChar } from "./isFullWidthChar"

export interface SplitTextToLinesOptions {
    /** 每一行的最大宽度，全角占据 1，半角占据 0.5 */
    maxWidth?: number
    /** 最大行数 */
    maxLines?: number
}

/**
 * 将文本按照指定的宽度拆分成多行
 * @param text 文本
 * @param options 选项
 * @returns 拆分后的文本行数组
 */
export function splitTextToLines(text: string, options?: SplitTextToLinesOptions): string[] {
    interface Line {
        str: string
        length: number
    }
    const { maxWidth: originMaxWidth = Infinity, maxLines = Infinity } = options ?? {}
    const maxWidth = originMaxWidth * 2
    const lines: Line[] = [{ str: "", length: 0 }]
    let overflow = false
    for (let i = 0; i < text.length; i++) {
        const char = text[i]
        const charLength = isFullWidthChar(char) ? 2 : 1
        const line = lines[lines.length - 1]
        if (line.length + charLength <= maxWidth) {
            line.str += char
            line.length += charLength
            continue
        }
        if (lines.length >= maxLines) {
            overflow = true
            break
        }
        lines.push({
            str: char,
            length: charLength
        })
    }
    if (overflow) {
        const last = lines[lines.length - 1]
        let { str, length } = last
        let final = 0
        for (let i = 0; i < str.length; i++) {
            const char = str[str.length - 1 - i]
            const charLength = isFullWidthChar(char) ? 2 : 1
            if (length - charLength + 3 <= maxWidth) {
                final = i
                break
            }
            length -= charLength
        }
        last.str = str.slice(0, -1 - final) + "..."
    }
    return lines.map(line => line.str)
}
