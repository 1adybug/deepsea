import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

for (const target of ["web", "node"]) {
    for (const field of ["dependencies", "devDependencies", "peerDependencies"]) {
        test(`${target}: detects React in ${field} and selects matching formats and syntax`, async t => {
            const root = await mkdtemp(join(tmpdir(), "deepsea-config-"))
            t.after(() => rm(root, { recursive: true, force: true }))
            await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture", [field]: { react: "*" } }))
            const module = new URL("../index.mjs", import.meta.url).href
            const code = `import { getRslibConfig } from ${JSON.stringify(module)}; console.log(JSON.stringify(await getRslibConfig({ target: ${JSON.stringify(target)} })()))`
            const result = spawnSync(process.execPath, ["--input-type=module", "-e", code], { cwd: root, encoding: "utf8", timeout: 15_000 })
            assert.equal(result.status, 0, result.stderr)
            const config = JSON.parse(result.stdout)
            assert.equal(config.output.target, target)

            assert.deepEqual(
                config.lib.map(lib => lib.format),
                target === "node" ? ["esm"] : ["esm", "cjs"],
            )

            assert.deepEqual(config.lib[0].dts, { abortOnError: true })
            if (target === "web") assert.equal(config.lib[1].dts, false)
            assert.equal(config.plugins.length, 1)
        })
    }
}
