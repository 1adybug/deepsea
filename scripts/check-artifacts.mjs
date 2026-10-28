import { access } from "node:fs/promises"
import { resolve } from "node:path"

import { readWorkspacePackages } from "./workspace.mjs"

let count = 0

function targets(value) {
    if (typeof value === "string") return [value]
    if (value && typeof value === "object") return Object.values(value).flatMap(targets)
    return []
}

for (const { directory, manifest } of (await readWorkspacePackages()).values()) {
    if (manifest.private) continue
    const paths = new Set([...targets(manifest.exports), ...targets(manifest.bin), ...[manifest.main, manifest.module, manifest.types].filter(Boolean)])

    for (const path of paths) {
        await access(resolve(directory, path)).catch(() => {
            throw new Error(`${manifest.name}: missing published entry ${path}`)
        })
    }

    count++
}

console.log(`Verified runtime, declaration and CLI entries for ${count} publishable packages.`)
