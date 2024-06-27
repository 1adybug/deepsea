export function getErrorMessage(error: unknown): string {
    if (error === "Failed to fetch") return "网络请求失败，请稍后再试"
    if (typeof error === "string") return error
    if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") return error.message
    return String(error)
}
