import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { test } from "node:test"
import { fileURLToPath, pathToFileURL } from "node:url"

test("shared build config produces consumable ESM, CJS and declarations in a clean package", async () => {
    const require = createRequire(import.meta.url)
    const binary = join(dirname(require.resolve("@rslib/core/package.json")), "bin/rslib.js")
    const fixtures = fileURLToPath(new URL("../../../.artifacts/", import.meta.url))
    await mkdir(fixtures, { recursive: true })
    const root = await mkdtemp(join(fixtures, "deepsea-build-"))

    try {
        await mkdir(join(root, "src"))
        await writeFile(join(root, "package.json"), JSON.stringify({ name: "build-fixture", type: "module" }))
        await writeFile(
            join(root, "tsconfig.json"),
            JSON.stringify({
                compilerOptions: {
                    rootDir: "src",
                    strict: true,
                    declaration: true,
                    target: "ESNext",
                    module: "ESNext",
                    moduleResolution: "Bundler",
                    skipLibCheck: true,
                },
                include: ["src"],
            }),
        )
        await writeFile(
            join(root, "rslib.config.mjs"),
            `import { getRslibConfig } from ${JSON.stringify(new URL("../index.mjs", import.meta.url).href)}\nexport default getRslibConfig()\n`,
        )
        await writeFile(join(root, "src/index.ts"), "export const answer: number = 42\n")
        const result = spawnSync(process.execPath, [binary, "build"], { cwd: root, encoding: "utf8", timeout: 60_000 })
        assert.equal(result.status, 0, result.stdout + result.stderr)
        assert.equal((await import(pathToFileURL(join(root, "dist/index.js")).href)).answer, 42)
        assert.equal(createRequire(import.meta.url)(join(root, "dist/index.cjs")).answer, 42)
        assert.match(await readFile(join(root, "dist/index.d.ts"), "utf8"), /answer: number/)
        await writeFile(join(root, "src/index.ts"), 'export const answer: number = "invalid"\n')
        const invalid = spawnSync(process.execPath, [binary, "build"], { cwd: root, encoding: "utf8", timeout: 60_000 })
        assert.equal(invalid.error, undefined)
        assert.notEqual(invalid.status, 0, "Type errors must fail the build")
        assert.match(invalid.stdout + invalid.stderr, /TS2322/)
    } finally {
        await rm(root, { recursive: true, force: true })
    }
})
