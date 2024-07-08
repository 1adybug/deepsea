/**
 * 将字符串或者字符串的数组变成字符串数组
 * @param id - 字符串或者字符串数组
 * @returns 字符串数组
 */
export function stringToArray(id: string | string[]) {
    return typeof id === "string" ? [id] : id
}
