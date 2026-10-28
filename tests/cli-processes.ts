import { type ChildProcess, spawn } from "node:child_process"
import { EventEmitter } from "node:events"

import { afterEach, expect, it, vi } from "vitest"

interface CommandArgs {
    args: string[]
}

interface CLI {
    build: (options: Record<string, string>, command: never) => Promise<void>
    dev: (options: Record<string, string>, command: never) => Promise<void>
    runCommand: (options: CommandArgs) => Promise<number>
    waitForChild: (child: ChildProcess) => Promise<number>
}

class Child extends EventEmitter {
    kill = vi.fn(() => true)
}

export function testCLIProcesses(cli: CLI) {
    const originalExitCode = process.exitCode

    afterEach(() => {
        process.exitCode = originalExitCode
        vi.clearAllMocks()
    })

    it("maps child exit codes, termination signals and startup failures", async () => {
        for (const [code, signal, expected] of [
            [0, null, 0],
            [7, null, 7],
            [null, "SIGTERM", 1],
            [null, null, 0],
        ] as const) {
            const child = new Child()
            const pending = cli.waitForChild(child as never)
            child.emit("close", code, signal)
            expect(await pending).toBe(expected)
        }

        const child = new Child(),
            error = new Error("startup failed")

        const pending = cli.waitForChild(child as never)
        child.emit("error", error)
        await expect(pending).rejects.toBe(error)
    })

    it("skips empty commands and forwards shell commands with their exit status", async () => {
        expect(await cli.runCommand({ args: [] })).toBe(0)
        expect(spawn).not.toHaveBeenCalled()
        const child = new Child()
        vi.mocked(spawn).mockReturnValue(child as never)
        const pending = cli.runCommand({ args: ["node", "script file.js"] })
        expect(spawn).toHaveBeenCalledWith(expect.stringContaining("script file.js"), { shell: true, stdio: "inherit" })
        child.emit("close", 3, null)
        expect(await pending).toBe(3)
    })

    it("propagates the wrapped build command's exit code", async () => {
        const child = new Child()
        vi.mocked(spawn).mockReturnValue(child as never)
        const pending = cli.build({}, { args: ["node", "build.js"] } as never)
        await vi.waitFor(() => expect(spawn).toHaveBeenCalledTimes(1))
        child.emit("close", 7, null)
        await pending
        expect(process.exitCode).toBe(7)
    })

    it("stops the development peer and preserves the command exit code", async () => {
        const watcher = new Child(),
            application = new Child()

        vi.mocked(spawn)
            .mockReturnValueOnce(watcher as never)
            .mockReturnValueOnce(application as never)

        const pending = cli.dev({}, { args: ["node", "dev.js"] } as never)
        await vi.waitFor(() => expect(spawn).toHaveBeenCalledTimes(2))
        application.emit("close", 2, null)
        await pending
        expect(watcher.kill).toHaveBeenCalledTimes(1)
        expect(process.exitCode).toBe(2)
    })

    it("cleans up both development processes after a startup error", async () => {
        const watcher = new Child(),
            application = new Child(),
            failure = new Error("watcher failed")

        vi.mocked(spawn)
            .mockReturnValueOnce(watcher as never)
            .mockReturnValueOnce(application as never)

        const pending = cli.dev({}, { args: ["node", "dev.js"] } as never)
        await vi.waitFor(() => expect(spawn).toHaveBeenCalledTimes(2))
        watcher.emit("error", failure)
        await expect(pending).rejects.toBe(failure)
        expect(application.kill).toHaveBeenCalledTimes(1)
    })
}
