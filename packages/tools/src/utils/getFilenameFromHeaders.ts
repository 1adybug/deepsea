/**
 * 从响应头中获取文件名
 * @param headers 响应头
 * @returns 文件名
 */
export function getFilenameFromHeaders(headers: Headers) {
    const disposition = headers.get("content-disposition")
    if (!disposition) return undefined
    const encoded = disposition.match(/(?:^|;)\s*filename\*=UTF-8''([^;]+)/i)

    if (encoded) {
        try {
            return decodeURIComponent(encoded[1].trim())
        } catch {}
    }

    const match = disposition.match(/(?:^|;)\s*filename=(?:"((?:\\.|[^"\\])*)"|([^;]*))/i)
    if (!match) return undefined
    return match[1]?.replace(/\\(.)/g, "$1") ?? match[2].trim()
}
