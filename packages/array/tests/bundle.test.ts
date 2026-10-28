import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import { pathToFileURL } from "node:url"

import { expect, it } from "vitest"

it("retains global per-method side effects in a production bundle and keeps pure bundles isolated", async () => {
    const directory = process.cwd()
    const require = createRequire(resolve(directory, "package.json"))
    const artifacts = resolve(directory, ".artifacts")
    await mkdir(artifacts, { recursive: true })
    const fixture = await mkdtemp(join(artifacts, "bundle-"))
    const rslib = dirname(require.resolve("@rslib/core/package.json"))
    const specifier = (path: string) => JSON.stringify(resolve(directory, path).replaceAll("\\", "/"))

    try {
        await writeFile(join(fixture, "package.json"), JSON.stringify({ name: "array-consumer-fixture", type: "module", sideEffects: false }))
        await writeFile(join(fixture, "global.mjs"), `import ${specifier("dist/generated/global/actual/chunk.js")}; export const result = [1, 2, 3].chunk(2);`)
        await writeFile(
            join(fixture, "pure.mjs"),
            `import chunk from ${specifier("dist/generated/pure/full/chunk.js")}; export const result = chunk([1, 2, 3], 2);`,
        )
        await writeFile(
            join(fixture, "rslib.config.mjs"),
            `export default {
            source: { entry: { global: './global.mjs', pure: './pure.mjs' } },
            lib: [{ format: 'cjs', bundle: true, autoExternal: false }],
            output: { target: 'node', minify: true }
        };`,
        )
        const build = spawnSync(process.execPath, [join(rslib, "bin/rslib.js"), "build"], { cwd: fixture, encoding: "utf8", timeout: 60_000 })
        expect(build.error).toBeUndefined()
        expect(build.status, build.stdout + build.stderr).toBe(0)

        for (const kind of ["pure", "global"]) {
            const file = pathToFileURL(join(fixture, "dist", `${kind}.cjs`)).href

            const code = `import assert from 'node:assert/strict';
                const before = Object.getOwnPropertyDescriptors(Array.prototype);
                const { result } = await import(${JSON.stringify(file)});
                assert.deepEqual(result, [[1, 2], [3]]);
                ${kind === "pure" ? "assert.deepEqual(Object.getOwnPropertyDescriptors(Array.prototype), before);" : "assert.equal(typeof Array.prototype.chunk, 'function'); assert.equal(Array.prototype.toExchange, undefined);"}`

            const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], { encoding: "utf8", timeout: 30_000 })
            expect(result.status, result.stdout + result.stderr).toBe(0)
        }
    } finally {
        await rm(fixture, { recursive: true, force: true })
    }
}, 90_000)
