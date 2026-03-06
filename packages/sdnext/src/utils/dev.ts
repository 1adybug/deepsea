import { spawn } from "child_process"
import { fileURLToPath } from "url"

import { Command } from "commander"

import { buildFolder } from "./build"
import { spawnCommand } from "./runCommand"

export async function dev(options: Record<string, string>, { args }: Command) {
    await buildFolder("shared")

    if (args.length === 0) return

    const watchPath = fileURLToPath(new URL("./watch.js", import.meta.url))

    const child = spawn(process.execPath, [watchPath], {
        stdio: "inherit",
    })

    const child2 = spawnCommand({
        args,
    })

    process.exitCode = await new Promise<number>((resolve, reject) => {
        let settled = false

        function onClose(code: number) {
            if (settled) return

            settled = true
            child.kill()
            child2.kill()
            resolve(code)
        }

        child.once("error", reject)
        child2.once("error", reject)
        child.once("close", (code, signal) => onClose(typeof code === "number" ? code : signal ? 1 : 0))
        child2.once("close", (code, signal) => onClose(typeof code === "number" ? code : signal ? 1 : 0))
    })
}
