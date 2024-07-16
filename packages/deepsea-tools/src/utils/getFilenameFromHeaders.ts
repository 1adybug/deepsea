/**
 * 从响应头中获取文件名
 * @param headers 响应头
 * @returns 文件名
 */
export function getFilenameFromHeaders(headers: Headers) {
    const disposition = headers.get("content-disposition")
    if (!disposition) return undefined
    const reg = /filename=(.+?);/
    const match = disposition.match(reg)
    if (!match) return undefined
    return match[1]
}
