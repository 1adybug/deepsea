import { glob, readdir, readFile } from "node:fs/promises"
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

export async function expandPackageExports(manifest, directory) {
    const exports = new Map()

    for (const [subpath, conditions] of Object.entries(manifest.exports)) {
        if (!subpath.includes("*")) {
            exports.set(subpath, conditions)
            continue
        }

        const pattern = conditions.import ?? conditions.types ?? conditions.require
        const [prefix, suffix] = pattern.split("*")
        let matches = 0

        for await (const file of glob(pattern, { cwd: directory })) {
            const normalized = "./" + file.replaceAll("\\", "/").replace(/^\.\//, "")
            const name = normalized.slice(prefix.length, suffix ? -suffix.length : undefined)
            exports.set(
                subpath.replaceAll("*", name),
                Object.fromEntries(Object.entries(conditions).map(([condition, path]) => [condition, path.replaceAll("*", name)])),
            )
            matches++
        }

        if (!matches) throw new Error(`${manifest.name}: export pattern has no files: ${pattern}`)
    }

    return exports
}
