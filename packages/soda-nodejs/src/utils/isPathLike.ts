import { PathLike } from "fs"

export function isPathLike(path: unknown): path is PathLike {
    return typeof path === "string" || path instanceof Buffer || path instanceof URL
}
