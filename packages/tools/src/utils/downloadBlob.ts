/**
 * blob 生成文件并下载
 * @param blob 文件的 blob
 * @param fileName 文件名
 * @returns 无
 */
export function downloadBlob(blob: Blob, fileName: string) {
    const link = document.createElement("a")
    link.download = fileName
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
}
