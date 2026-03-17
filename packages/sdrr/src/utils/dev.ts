import { spawn } from "child_process"

import { Command } from "commander"

import { createRouter } from "./createRouter"
import { excludeRouter } from "./excludeRouter"
import { spawnCommand } from "./runCommand"

export async function dev(options: Record<string, string>, { args }: Command) {
    await excludeRouter()

    await createRouter()

    if (args.length === 0) return

    const watchPath = import.meta.resolve("./watch.js").replace(process.platform === "win32" ? /^file:\/\/\// : /^file:\/\//, "")

    const child = spawn(process.execPath, [watchPath])

    const child2 = spawnCommand({ args })

    child.on("close", () => child2.kill())

    child2.on("close", () => child.kill())
}
