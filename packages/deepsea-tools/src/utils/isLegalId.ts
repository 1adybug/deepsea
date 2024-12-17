import { idReg } from "@/constants/index"
import { getIdChecksum } from "./getIdChecksum"

/**
 * 判断是否是合法身份证号
 * @param id - 身份证号
 * @param strict - 是否严格校验
 * @returns 是否是合法身份证号
 */
export function isLegalId(id: string, strict?: boolean): boolean {
    const test = idReg.test(id)
    if (!strict || !test) return test
    return id[17].toUpperCase() === getIdChecksum(id)
}
