/**
 * 从身份证中获取年龄
 * @param id - 身份证号
 * @returns 年龄
 */
export function getAgeFromId(id: string) {
    return new Date().getFullYear() - Number(id.slice(6, 10))
}
