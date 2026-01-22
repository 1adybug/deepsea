import { flattenZodError } from "./flattenZodError"
import { isZodError } from "./isZodError"

/**
 * 获取错误信息
 * @param error 错误
 * @returns 错误信息
 */
export function getErrorMessage(error: unknown): string {
    if (isZodError(error)) return flattenZodError(error).join(" / ")
    if (error === "Failed to fetch") return "网络请求失败，请稍后再试"
    if (typeof error === "string") return error
    if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message
    return String(error)
}
