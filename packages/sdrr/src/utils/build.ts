import { spawn } from "child_process"

import { Command } from "commander"

import { createRouter } from "./createRouter"
import { excludeRouter } from "./excludeRouter"

export async function build(options: Record<string, string>, { args }: Command) {
    await excludeRouter()

    await createRouter()

    if (args.length === 0) return

    spawn(args.join(" "), {
        stdio: "inherit",
        shell: true,
    })
}
