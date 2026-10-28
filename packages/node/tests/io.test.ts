import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

import { list } from "tar"
import { afterEach, describe, expect, it } from "vitest"

import { compress } from "../src/utils/compress"
import { execAsync } from "../src/utils/execAsync"
import { isPathLike } from "../src/utils/isPathLike"
import { saveFile } from "../src/utils/saveFile"
import { saveResponse } from "../src/utils/saveResponse"
import { getDefaultOptions, setDefaultOptions, spawnAsync } from "../src/utils/spawnAsync"

const roots: string[] = []

afterEach(async () => {
    setDefaultOptions({})
    await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function fixture() {
    const root = await mkdtemp(join(tmpdir(), "deepsea-node-"))
    roots.push(root)
    return root
}

describe("processes", () => {
    it("exposes the spawned child and resolves only on successful exit", async () => {
        const command = spawnAsync(process.execPath, ["-e", "process.exit(0)"], { stdio: "ignore" })
        expect(command.child.pid).toBeTypeOf("number")
        expect(await command).toBe(command.child)
        await expect(spawnAsync(process.execPath, ["-e", "process.exit(7)"], { stdio: "ignore" })).rejects.toThrow("code 7")
    })

    it("rejects missing executables instead of emitting an unhandled error", async () => {
        await expect(spawnAsync("deepsea-executable-that-does-not-exist", [], { stdio: "ignore" })).rejects.toMatchObject({ code: "ENOENT" })
    })

    it("supports default options, updater functions and per-call overrides", async () => {
        const root = await fixture()
        setDefaultOptions({ cwd: root, stdio: "ignore" })
        setDefaultOptions(prev => ({ ...prev, env: { ...process.env, DEEPSEA_TEST: "yes" } }))
        expect(getDefaultOptions().cwd).toBe(root)
        await spawnAsync(process.execPath, ["-e", "if(process.env.DEEPSEA_TEST !== 'yes') process.exit(1)"])
        await spawnAsync(process.execPath, ["-e", "if(process.env.DEEPSEA_TEST !== 'override') process.exit(1)"], {
            env: { ...process.env, DEEPSEA_TEST: "override" },
        })
    })

    it("executes commands as text or buffers and rejects nonzero exit codes", async () => {
        const script = join(await fixture(), "output.cjs")
        await writeFile(script, 'process.stdout.write("hello")')
        const command = `"${process.execPath}" "${script}"`
        expect(await execAsync(command)).toBe("hello")
        expect(await execAsync(command, { encoding: "buffer" })).toEqual(Buffer.from("hello"))
        expect(await execAsync(command, { encoding: "buffer", decode: { encoding: "utf8" } })).toBe("hello")
        await writeFile(script, "process.exit(5)")
        await expect(execAsync(command)).rejects.toMatchObject({ code: 5 })
    })
})

describe("file and response streams", () => {
    it("saves binary File and Response contents exactly", async () => {
        const root = await fixture()
        const bytes = new Uint8Array([0, 1, 127, 128, 255])
        await saveFile({ input: new File([bytes], "data.bin"), output: join(root, "file.bin") })
        await saveResponse(new Response(bytes), join(root, "response.bin"))
        expect(await readFile(join(root, "file.bin"))).toEqual(Buffer.from(bytes))
        expect(await readFile(join(root, "response.bin"))).toEqual(Buffer.from(bytes))
    })

    it("rejects unwritable destinations and source stream failures", async () => {
        const root = await fixture()
        await expect(saveFile({ input: new File(["x"], "x"), output: join(root, "missing", "x") })).rejects.toMatchObject({ code: "ENOENT" })

        const body = new ReadableStream({
            start(controller) {
                controller.error(new Error("source failed"))
            },
        })

        await expect(saveResponse(new Response(body), join(root, "bad"))).rejects.toThrow("source failed")
        await expect(saveResponse(new Response(null), join(root, "empty"))).rejects.toThrow()
    })

    it("recognizes supported path representations", () => {
        for (const path of ["file.txt", Buffer.from("file.txt"), pathToFileURL(process.cwd())]) expect(isPathLike(path)).toBe(true)
        for (const value of [null, undefined, {}, 1, new Uint8Array(2)]) expect(isPathLike(value)).toBe(false)
    })
})

it("creates a gzip tar archive containing nested Unicode filenames", async () => {
    const root = await fixture()
    const input = join(root, "source")
    await mkdir(join(input, "nested"), { recursive: true })
    await writeFile(join(input, "nested", "数据.txt"), "data")
    const output = join(root, "archives", "data.tar.gz")
    expect(await compress({ input, output })).toBe(output)

    const entries: string[] = []

    await list({
        file: output,
        onReadEntry: entry => {
            entries.push(entry.path)
        },
    })
    expect(entries).toContain("source/nested/数据.txt")
    await expect(compress({ input: join(root, "missing"), output })).rejects.toThrow("Source folder")
})
