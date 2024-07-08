/**
 * 将浏览器中直接复制的 headers 转换为对象
 * @param headers 复制的 headers
 * @returns headers 对象
 */
export function getHeaders(headers: string): Headers {
    return headers
        .split("\n")
        .map(str => str.trim())
        .filter(str => str && !str.startsWith(":"))
        .reduce((acc: Headers, str) => {
            const index = str.indexOf(":")
            if (index < 1) throw new Error(`无效的字段${str}`)
            const key = str.slice(0, index).trim()
            const value = str.slice(index + 1).trim()
            acc.set(key, value)
            return acc
        }, new Headers())
}
