import { clsm } from "deepsea-tools"

/**
 * 让 clsx 支持 tailwindcss 和 classNames 的合并
 * @param inputs classNames 对象
 * @returns 合并后的 classNames 对象
 */
export function aclsm<T extends string, U>(
    ...inputs: (
        | (Partial<Record<T, string | undefined | null>> | undefined | null)
        | ((params: U) => Partial<Record<T, string | undefined | null>> | undefined | null)
    )[]
): (params: U) => Partial<Record<T, string>> {
    return function classNames(params: U) {
        return clsm(...inputs.map(item => (typeof item === "function" ? item(params) : item)))
    }
}
