import { mkdtemp, readFile, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { expect, it } from "vitest"

import { getSharedModuleInfo, isScriptModule, normalizePathSeparator, toKebabCase, writeGeneratedFile } from "../src/utils/sharedArtifact"

it("normalizes shared module paths and preserves acronym boundaries", () => {
    expect(normalizePathSeparator("shared\\HTTPServer.ts")).toBe("shared/HTTPServer.ts")
    expect(toKebabCase("HTTPServer")).toBe("http-server")
    expect(getSharedModuleInfo(join("shared", "nested", "loadData.ts"))).toMatchObject({ importPath: "nested/loadData", name: "loadData", ext: ".ts" })
    expect(isScriptModule("data.ts")).toBe(true)
    expect(isScriptModule("image.png")).toBe(false)
})

it("creates parent directories and leaves identical generated files untouched", async () => {
    const root = await mkdtemp(join(tmpdir(), "sdnext-artifact-"))

    try {
        const path = join(root, "nested/action.ts")
        await writeGeneratedFile({ path, content: "export const value = 1\n" })
        const initial = await stat(path, { bigint: true })
        await writeGeneratedFile({ path, content: "export const value = 1\n" })
        expect((await stat(path, { bigint: true })).mtimeNs).toBe(initial.mtimeNs)
        await writeGeneratedFile({ path, content: "export const value = 2\n" })
        expect(await readFile(path, "utf8")).toContain("value = 2")
    } finally {
        await rm(root, { recursive: true, force: true })
    }
})
