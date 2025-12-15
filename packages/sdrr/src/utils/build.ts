import { spawn } from "child_process"

import { Command } from "commander"

import { createRouter } from "./createRouter"

export async function build(options: Record<string, string>, command: Command) {
    const args = command.args

    await createRouter()

    if (args.length === 0) return

    if (args.at(-1)?.toLowerCase() !== "--watch" && args.at(-1)?.toLowerCase() !== "-w") {
        spawn(args.at(0)!, args.slice(1), {
            stdio: "inherit",
            shell: true,
        })

        return
    }

    console.log("watch mode")

    const watchPath = import.meta.resolve("./watch.js").replace(process.platform === "win32" ? /^file:\/\/\// : /^file:\/\//, "")

    const child = spawn(process.execPath, [watchPath])

    const child2 = spawn(args.at(0)!, args.slice(1, -1), {
        stdio: "inherit",
        shell: true,
    })

    child.on("close", () => child2.kill())

    child2.on("close", () => child.kill())
}
