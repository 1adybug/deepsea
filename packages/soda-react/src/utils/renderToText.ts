import { ReactNode } from "react"
import { renderToString } from "react-dom/server"

export function renderToText(node: ReactNode): string {
    if (node === null || node === undefined) return ""
    if (typeof node === "string") return node
    if (typeof node === "number") return node.toString()
    if (typeof node === "bigint") return node.toString()
    if (typeof node === "boolean") return ""
    if (typeof node === "symbol") {
        console.error("Symbols are not valid as a React child.")
        return ""
    }
    if (typeof node === "function") {
        console.error("Functions are not valid as a React child.")
        return ""
    }
    const str = renderToString(node)
    const doc = new DOMParser().parseFromString(str, "text/html")
    return doc.body.innerText
}
