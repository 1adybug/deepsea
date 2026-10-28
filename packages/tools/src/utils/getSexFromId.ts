/**
 * 从身份证中获取性别，0是女性，1是男性
 * @param id - 身份证号
 * @returns 性别
 */
export function getSexFromId(id: string): 0 | 1 {
    return (Number(id.slice(-2, -1)) % 2) as 0 | 1
}
