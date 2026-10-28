/**
 * 获取身份证号码的校验码
 * @param id 身份证号码
 * @returns 校验码
 */
export function getIdChecksum(id: string) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]

    const checkDigits = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]

    const sum = id
        .slice(0, 17)
        .split("")
        .reduce((acc, cur, i) => acc + parseInt(cur, 10) * weights[i], 0)

    const remainder = sum % 11
    return checkDigits[remainder]
}
