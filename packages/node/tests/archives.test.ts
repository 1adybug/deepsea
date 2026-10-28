import { execFile } from "node:child_process"
import { cpus } from "node:os"

import { afterEach, expect, it, vi } from "vitest"
import which from "which"

import { unzip } from "../src/utils/unzip"
import { zip } from "../src/utils/zip"

vi.mock("which", () => ({ default: vi.fn(async () => "7z") }))

vi.mock("node:child_process", async () => {
    const { promisify } = await import("node:util")

    const execFile = vi.fn((_command: string, _args: string[], _options: object, callback: Function) => {
        callback(null, "archive complete", "")
        return {}
    })

    Object.defineProperty(execFile, promisify.custom, {
        value: (...args: [string, string[], object]) =>
            new Promise((resolve, reject) =>
                execFile(...args, (error: Error | null, stdout: string, stderr: string) => (error ? reject(error) : resolve({ stdout, stderr }))),
            ),
    })

    return { execFile }
})

afterEach(() => vi.clearAllMocks())

it("passes archive filenames, spaces and shell metacharacters as literal arguments", async () => {
    expect(
        await zip({
            input: ["one file.txt", "two&file.txt"],
            output: "archive file.zip",
            level: 9,
            password: "test password",
            thread: 2,
            filter: ["*.log", "temp/*"],
            cwd: "/fixture",
        }),
    ).toBe("archive complete")

    expect(execFile).toHaveBeenCalledWith(
        "7z",
        ["a", "archive file.zip", "one file.txt", "two&file.txt", "-mmt=2", "-mx=9", "-ptest password", "-x!*.log", "-x!temp/*"],
        { cwd: "/fixture" },
        expect.any(Function),
    )
})

it("uses automatic or maximum concurrency and supports a single exclusion", async () => {
    await zip({ input: "source", output: "archive.zip" })
    expect(vi.mocked(execFile).mock.lastCall?.[1]).toContain("-mmt=on")
    await zip({ input: "source", output: "archive.zip", thread: "max", filter: "*.tmp" })
    expect(vi.mocked(execFile).mock.lastCall?.[1]).toEqual(expect.arrayContaining([`-mmt=${cpus().length}`, "-x!*.tmp"]))
})

it("extracts an archive to a literal output path", async () => {
    await expect(unzip({ input: "my archive.zip", output: "target folder", cwd: "/fixture" })).resolves.toBe("archive complete")
    expect(execFile).toHaveBeenCalledWith("7z", ["x", "my archive.zip", "-otarget folder"], { cwd: "/fixture" }, expect.any(Function))
})

it("propagates missing 7-Zip failures without starting a command", async () => {
    const failure = new Error("not found")
    vi.mocked(which).mockRejectedValueOnce(failure)
    await expect(zip({ input: "source", output: "archive.zip" })).rejects.toBe(failure)
    expect(execFile).not.toHaveBeenCalled()
})
