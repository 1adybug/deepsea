import assert from "node:assert/strict"
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { test } from "node:test"

import { getExports, writeCode } from "../exports.mjs"

test("barrel generation excludes declarations, tests and nested directories, and stays stable on rebuild", async t => {
    const root = await mkdtemp(join(tmpdir(), "deepsea-exports-"))
    t.after(() => rm(root, { recursive: true, force: true }))
    await mkdir(join(root, "src/utils/nested"), { recursive: true })
    await mkdir(join(root, "src/components"))
    await Promise.all(
        ["utils/z.ts", "utils/a.ts", "utils/types.d.ts", "utils/a.test.ts", "utils/a.spec.tsx", "components/Button.tsx", "index.ts"].map(file =>
            writeFile(join(root, "src", file), ""),
        ),
    )
    const exports = await getExports(root)
    assert.deepEqual(exports, ['export * from "@/components/Button"', 'export * from "@/utils/a"', 'export * from "@/utils/z"'])
    const output = join(root, "src/index.ts")
    await writeCode(output, exports.join("\n"))
    const before = await stat(output, { bigint: true })
    await writeCode(output, exports.join("\n"))
    assert.equal((await stat(output, { bigint: true })).mtimeNs, before.mtimeNs)
    await rm(join(root, "src/utils/a.ts"))
    await writeCode(output, (await getExports(root)).join("\n"))
    assert.doesNotMatch(await readFile(output, "utf8"), /utils\/a/)
})

test("barrel generation handles empty folders and propagates missing source errors", async t => {
    const root = await mkdtemp(join(tmpdir(), "deepsea-empty-"))
    t.after(() => rm(root, { recursive: true, force: true }))
    await assert.rejects(getExports(root), { code: "ENOENT" })
    await mkdir(join(root, "src"))
    assert.deepEqual(await getExports(root), [])
    await writeCode(join(root, "src/index.ts"), "")
    assert.equal(await readFile(join(root, "src/index.ts"), "utf8"), "\n")
})
