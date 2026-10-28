import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve, sep } from "node:path"

import { readWorkspacePackages } from "./workspace.mjs"

const root = process.cwd()
const manifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"))
const config = manifest.compatibility
if (!config) throw new Error("This command only builds compatibility packages")
const target = (await readWorkspacePackages()).get(config.target)
if (!target || target.group !== "packages") throw new Error(`Unknown implementation: ${config.target}`)

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

for (const [subpath, conditions] of Object.entries(manifest.exports)) {
    if (!target.manifest.exports[subpath]) throw new Error(`${config.target} does not export ${subpath}`)
    const specifier = config.target + (subpath === "." ? "" : subpath.slice(1))
    const forwarding = `export * from "${specifier}"\n${config.defaults.includes(subpath) ? `export { default } from "${specifier}"\n` : ""}`
    if (conditions.types) await writeEntry(conditions.types, config.typeOnly?.includes(subpath) ? `/// <reference types="${specifier}" />\n` : forwarding)
    if (conditions.import) await writeEntry(conditions.import, forwarding)
    if (conditions.require?.endsWith(".cjs")) await writeEntry(conditions.require, `module.exports = require("${specifier}")\n`)
}

for (const [bin, subpath] of Object.entries(config.bins ?? {})) {
    const specifier = config.target + (subpath === "." ? "" : subpath.slice(1))
    await writeEntry(manifest.bin[bin], `#!/usr/bin/env node\nimport "${specifier}"\n`)
}

console.log(`${manifest.name} forwards to ${config.target}`)
