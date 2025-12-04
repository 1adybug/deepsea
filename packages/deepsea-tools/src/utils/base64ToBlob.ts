/**
 * base64 转 blob
 * @param base64 需要转换的 base64
 * @returns blob
 */
export function base64ToBlob(base64: string): Blob {
    const bytes = atob(base64.split(",")[1])
    const array = new Uint8Array(bytes.length)
    const mime = base64.match(/^data:(.*?);/)![1]
    for (let i = 0; i < bytes.length; i++) array[i] = bytes.charCodeAt(i)
    const blob = new Blob([array], { type: mime })
    return blob
}
