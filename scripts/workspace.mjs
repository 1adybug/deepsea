import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

export const workspaceRoot = fileURLToPath(new URL("../", import.meta.url))

export async function readWorkspacePackages() {
    const packages = new Map()

    for (const group of ["apps", "packages", "compat", "tooling"]) {
        for (const entry of await readdir(join(workspaceRoot, group), { withFileTypes: true })) {
            if (!entry.isDirectory()) continue
            const directory = join(workspaceRoot, group, entry.name)
            const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8"))
            packages.set(manifest.name, { manifest, directory, group })
        }
    }

    return packages
}
