import { idReg } from "@constants/index"

/**
 * 判断是否是合法身份证号
 * @param id - 身份证号\
 * @returns 是否是合法身份证号
 */
export function isLegalId(id: string): boolean {
    return idReg.test(id)
}
