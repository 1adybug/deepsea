import { spawnSync } from "node:child_process"
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

import { afterEach, expect, it } from "vitest"

import { removeGeneratedFile } from "../src/utils/sharedArtifact"

const roots: string[] = []

afterEach(async () => {
    await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function fixture() {
    const root = await mkdtemp(join(tmpdir(), "deepsea-next-"))
    roots.push(root)
    return root
}

function run(root: string, code: string) {
    const module = new URL("../dist/utils/syncSharedArtifacts.js", import.meta.url).href
    const result = spawnSync(
        process.execPath,
        [
            "--input-type=module",
            "-e",
            `import { syncSharedArtifacts, removeSharedArtifacts, removeSharedArtifactDirectory } from ${JSON.stringify(module)}; ${code}`,
        ],
        { cwd: root, encoding: "utf8", timeout: 15_000 },
    )
    expect(result.error).toBeUndefined()
    expect(result.status, result.stdout + result.stderr).toBe(0)
}

it("generates actions and a sorted route registry, then removes stale artifacts", async () => {
    const root = await fixture()
    await mkdir(join(root, "shared/nested"), { recursive: true })
    await writeFile(join(root, "shared/nested/getUser.ts"), "export const getUser = () => ({ success: true })")
    await writeFile(join(root, "shared/saveUser.ts"), "export const saveUser = () => ({ success: true })")
    await writeFile(join(root, "shared/asset.png"), "ignored")
    run(
        root,
        'await syncSharedArtifacts("shared/nested/getUser.ts"); await syncSharedArtifacts("shared/saveUser.ts"); await syncSharedArtifacts("shared/asset.png");',
    )
    const action = await readFile(join(root, "actions/nested/getUser.ts"), "utf8")
    expect(action).toContain('"use server"')
    expect(action).toContain('from "../../shared/nested/getUser"')
    expect(action).toContain("getUserAction = createResponseFn(getUser)")
    const routePath = join(root, "app/api/action/[...action]/route.ts")
    const route = await readFile(routePath, "utf8")
    expect(route).toContain("registerRoute(getUser)")
    expect(route).toContain("registerRoute(saveUser)")
    expect(route).toContain("status: 404")
    expect(route).not.toContain("asset.png")
    expect(route.indexOf("registerRoute(getUser)")).toBeLessThan(route.indexOf("registerRoute(saveUser)"))
    const before = await stat(routePath, { bigint: true })
    run(root, 'await syncSharedArtifacts("shared/saveUser.ts")')
    expect((await stat(routePath, { bigint: true })).mtimeNs).toBe(before.mtimeNs)
    await rm(join(root, "shared/nested"), { recursive: true })
    run(root, 'await removeSharedArtifactDirectory("shared/nested")')
    expect(await readFile(routePath, "utf8")).not.toContain("registerRoute(getUser)")
    await expect(stat(join(root, "actions/nested"))).rejects.toMatchObject({ code: "ENOENT" })
    await rm(join(root, "shared/saveUser.ts"))
    run(root, 'await removeSharedArtifacts("shared/saveUser.ts")')
    expect(await readFile(routePath, "utf8")).not.toContain("registerRoute(saveUser)")
})

it("uses a project root alias declared in JSONC configuration", async () => {
    const root = await fixture()
    await mkdir(join(root, "shared"))
    await writeFile(join(root, "tsconfig.json"), '{/* root */"compilerOptions":{"paths":{"@/*":["./*"]},},}')
    await writeFile(join(root, "shared/getData.ts"), "export const getData = () => null")
    run(root, 'await syncSharedArtifacts("shared/getData.ts")')
    expect(await readFile(join(root, "actions/getData.ts"), "utf8")).toContain('from "@/shared/getData"')
})

it("prunes empty generated directories without deleting the output root or unrelated files", async () => {
    const root = await fixture(),
        stopPath = join(root, "actions")

    await mkdir(join(stopPath, "nested/deep"), { recursive: true })
    await writeFile(join(stopPath, "keep.txt"), "keep")
    const path = join(stopPath, "nested/deep/generated.ts")
    await writeFile(path, "generated")
    await removeGeneratedFile({ path, stopPath })
    expect(await readFile(join(stopPath, "keep.txt"), "utf8")).toBe("keep")
    await expect(stat(join(stopPath, "nested"))).rejects.toMatchObject({ code: "ENOENT" })
    await removeGeneratedFile({ path, stopPath })
    expect((await stat(stopPath)).isDirectory()).toBe(true)
})

it.each(["--help", "--version"])("runs the installed CLI entry with %s", argument => {
    const executable = fileURLToPath(new URL("../dist/index.js", import.meta.url))
    const result = spawnSync(process.execPath, [executable, argument], { encoding: "utf8", timeout: 15_000 })
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toContain(argument === "--help" ? "Usage:" : "0.")
})
