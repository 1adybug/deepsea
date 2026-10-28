import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

import { expect, it } from "vitest"

export function runCompatibilityTests() {
    const directory = process.cwd()
    const manifestPath = resolve(directory, "package.json")
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"))
    const config = manifest.compatibility
    const coreDirectory = resolve(directory, "../../packages", config.target.split("/")[1])
    const core = JSON.parse(readFileSync(resolve(coreDirectory, "package.json"), "utf8"))
    const require = createRequire(manifestPath)

    function resolveExport(exports: Record<string, Record<string, string>>, subpath: string): Record<string, string> {
        if (exports[subpath]) return exports[subpath]!

        for (const pattern of Object.keys(exports)
            .filter(key => key.includes("*"))
            .sort((a, b) => b.length - a.length)) {
            const [prefix, suffix] = pattern.split("*") as [string, string]
            if (!subpath.startsWith(prefix) || !subpath.endsWith(suffix)) continue
            const value = subpath.slice(prefix.length, suffix ? -suffix.length : undefined)
            return Object.fromEntries(Object.entries(exports[pattern]!).map(([name, path]) => [name, path.replaceAll("*", value)]))
        }

        throw new Error(`Unknown export: ${subpath}`)
    }

    const paths = config.testSubpaths ?? Object.keys(manifest.exports).filter(key => !key.includes("*"))

    for (const subpath of paths as string[]) {
        const conditions = resolveExport(manifest.exports, subpath)
        if (config.typeOnly?.includes(subpath) || (subpath === "." && config.bins && Object.values(config.bins).includes("."))) continue
        const target = resolveExport(core.exports, subpath)

        it(`${subpath}: ESM exports reference the implementation without duplicating state`, async () => {
            const legacy = await import(pathToFileURL(resolve(directory, conditions.import!)).href)
            const current = await import(pathToFileURL(resolve(coreDirectory, target.import)).href)
            expect(Object.keys(legacy).sort()).toEqual(Object.keys(current).sort())
            for (const name of Object.keys(current)) expect(legacy[name]).toBe(current[name])
        }, 60_000)

        if (conditions.require?.endsWith(".cjs")) {
            it(`${subpath}: CommonJS forwards the same module object`, () => {
                const suffix = subpath === "." ? "" : subpath.slice(1)
                expect(require(manifest.name + suffix)).toBe(require(config.target + suffix))
            }, 60_000)
        }
    }

    for (const bin of Object.keys(config.bins ?? {})) {
        it(`${bin}: the original executable forwards help and version to the new CLI`, () => {
            for (const argument of ["--help", "--version"]) {
                const result = spawnSync(process.execPath, [resolve(directory, manifest.bin[bin]), argument], { encoding: "utf8", timeout: 30_000 })
                expect(result.error).toBeUndefined()
                expect(result.status, result.stderr).toBe(0)
                expect(result.stdout).toContain(argument === "--help" ? "Usage:" : core.version)
            }
        })
    }
}
