import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const groups = ["apps", "packages", "tooling", "compat"]

const packages = new Map()

const errors = []

for (const group of groups) {
    for (const entry of await readdir(group, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const directory = join(group, entry.name)
        const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8"))
        if (packages.has(manifest.name)) errors.push(`Duplicate package name: ${manifest.name}`)
        if (["apps", "tooling"].includes(group) && manifest.private !== true) errors.push(`${directory} must be private`)
        if (group !== "compat" && !manifest.name.startsWith("@1adybug/")) errors.push(`${directory} must use the @1adybug scope`)
        if (["packages", "compat"].includes(group) && !manifest.private && !manifest.exports) errors.push(`${directory} needs explicit exports`)
        if (!manifest.scripts?.test) errors.push(`${directory} needs a real test command`)
        packages.set(manifest.name, { group, directory, manifest })
    }
}

for (const { directory, manifest, group } of packages.values()) {
    if (group === "compat") {
        const target = manifest.compatibility?.target
        if (packages.get(target)?.group !== "packages") errors.push(`${directory}: invalid compatibility implementation ${target}`)
        if (Object.keys(manifest.dependencies ?? {}).length !== 1 || manifest.dependencies[target] !== "workspace:*")
            errors.push(`${directory}: compatibility packages must only depend on their implementation`)
    }

    for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
        for (const [name, range] of Object.entries(manifest[field] ?? {})) {
            const dependency = packages.get(name)
            if (!dependency && !range.startsWith("workspace:") && !range.startsWith("catalog:"))
                errors.push(`${directory}: external dependency ${name} must use the shared catalog`)
            if (range.startsWith("workspace:") && !dependency) errors.push(`${directory}: unknown workspace dependency ${name}`)
            if (!dependency) continue
            if (dependency.group === "compat") errors.push(`${directory}: implementations cannot depend on compatibility packages`)
            if (!range.startsWith("workspace:")) errors.push(`${directory}: ${name} must use the workspace protocol`)
            if (dependency.group === "apps") errors.push(`${directory}: apps cannot be package dependencies`)
            if (!manifest.private && dependency.manifest.private && field !== "devDependencies")
                errors.push(`${directory}: published ${field} cannot reference private package ${name}`)
        }
    }
}

if (errors.length) {
    console.error(errors.join("\n"))
    process.exitCode = 1
} else console.log(`Workspace boundaries verified for ${packages.size} packages.`)
