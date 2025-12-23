import { spawn } from "child_process"

import { Command } from "commander"

import { buildFolder } from "./build"
import { excludeActions } from "./excludeActions"

export async function dev(options: Record<string, string>, { args }: Command) {
    await excludeActions()

    await buildFolder("shared")

    if (args.length === 0) return

    const watchPath = import.meta.resolve("./watch.js").replace(process.platform === "win32" ? /^file:\/\/\// : /^file:\/\//, "")

    const child = spawn(process.execPath, [watchPath])

    const child2 = spawn(args.at(0)!, args.slice(1), {
        stdio: "inherit",
        shell: true,
    })

    child.on("close", () => child2.kill())

    child2.on("close", () => child.kill())
}
