import { version } from "react"

const reg = /(\d+)\.(\d+)\.(\d+)/

export function getReactVersion() {
    return version.match(reg)!.slice(1).map(Number)
}
