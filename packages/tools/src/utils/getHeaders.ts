/**
 * 将浏览器中直接复制的 headers 转换为对象
 * @param str 复制的 headers
 * @returns headers 对象
 */
export function getHeaders(str: string): Headers {
    const reg = /^(.+?):$\n^(.+?)$/gm
    const reg2 = new RegExp(reg.source, "m")
    const headers = new Headers()
    const match = str.match(reg)
    if (!match) throw new Error("headers 格式错误")

    Array.from(match).forEach(item => {
        const match2 = item.match(reg2)!
        headers.set(match2[1], match2[2])
    })

    return headers
}
