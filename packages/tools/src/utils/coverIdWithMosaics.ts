/**
 * 将身份证打码
 * @param id - 身份证号
 * @returns 打码后的身份证号
 */
export function coverIdWithMosaics(id: string) {
    return id.replace(/^(.{6})(.{8})(.+)$/, `$1********$3`)
}
