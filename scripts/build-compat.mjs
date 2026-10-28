import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, matchesGlob, resolve, sep } from "node:path"

import { expandPackageExports, readWorkspacePackages } from "./workspace.mjs"

const root = process.cwd()
const manifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
const config = manifest.compatibility
if (!config) throw new Error("This command only builds compatibility packages")
const target = (await readWorkspacePackages()).get(config.target)
if (!target || target.group !== "packages") throw new Error(`Unknown implementation: ${config.target}`)
const targetExports = await expandPackageExports(target.manifest, target.directory)

if (config.mirrorExports) {
    const entryPath = key => (key === "." ? "index" : `entries/${key.slice(2).replace(/\.js$/, "")}`)
    manifest.exports = Object.fromEntries(
        Object.entries(target.manifest.exports).map(([key, conditions]) => [
            key,
            Object.fromEntries(
                Object.keys(conditions).map(condition => [
                    condition,
                    `./dist/${entryPath(key)}${condition === "types" ? ".d.ts" : condition === "require" ? ".cjs" : ".js"}`,
                ]),
            ),
        ]),
    )
    const globalRoots = new Set()

    for (const [key, conditions] of targetExports) {
        const patterns = target.manifest.sideEffects
        if (
            conditions.import &&
            (patterns === undefined || patterns === true || (Array.isArray(patterns) && patterns.some(pattern => matchesGlob(conditions.import, pattern))))
        )
            globalRoots.add(key.slice(2).split("/")[0].replace(/\.js$/, ""))
    }

    manifest.sideEffects = [...globalRoots].sort().flatMap(name => [`./dist/entries/${name}.*`, `./dist/entries/${name}/**`])
    const content = JSON.stringify(manifest, null, 4) + "\n"
    const file = resolve(root, "package.json")
    if ((await readFile(file, "utf8")) !== content) await writeFile(file, content, "utf8")
}

async function writeEntry(path, content) {
    const file = resolve(root, path)
    if (!file.startsWith(resolve(root, "dist") + sep)) throw new Error(`Unsafe output: ${file}`)
    await mkdir(dirname(file), { recursive: true })
    let previous

    try {
        previous = await readFile(file, "utf8")
    } catch (error) {
        if (error.code !== "ENOENT") throw error
    }

    if (previous !== content) await writeFile(file, content, "utf8")
}

const ownExports = new Map()

for (const [subpath, conditions] of Object.entries(manifest.exports)) {
    if (!subpath.includes("*")) {
        ownExports.set(subpath, conditions)
        continue
    }

    const [prefix, suffix] = subpath.split("*")

    for (const key of targetExports.keys()) {
        if (!key.startsWith(prefix) || !key.endsWith(suffix)) continue
        const value = key.slice(prefix.length, suffix ? -suffix.length : undefined)
        ownExports.set(key, Object.fromEntries(Object.entries(conditions).map(([name, path]) => [name, path.replaceAll("*", value)])))
    }
}

for (const [subpath, conditions] of ownExports) {
    if (!targetExports.has(subpath)) throw new Error(`${config.target} does not export ${subpath}`)
    const specifier = config.target + (subpath === "." ? "" : subpath.slice(1))
    const forwarding = `export * from "${specifier}"\n${config.defaults.includes(subpath) || config.defaults.includes("*") ? `export { default } from "${specifier}"\n` : ""}`
    if (conditions.types) await writeEntry(conditions.types, config.typeOnly?.includes(subpath) ? `/// <reference types="${specifier}" />\n` : forwarding)
    if (conditions.import) await writeEntry(conditions.import, forwarding)
    if (conditions.require?.endsWith(".cjs")) await writeEntry(conditions.require, `module.exports = require("${specifier}")\n`)
}

for (const [bin, subpath] of Object.entries(config.bins ?? {})) {
    const specifier = config.target + (subpath === "." ? "" : subpath.slice(1))
    await writeEntry(manifest.bin[bin], `#!/usr/bin/env node\nimport "${specifier}"\n`)
}

console.log(`${manifest.name} forwards to ${config.target}`)
