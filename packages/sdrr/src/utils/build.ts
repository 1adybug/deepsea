import { Command } from "commander"

import { createRouter } from "./createRouter"
import { excludeRouter } from "./excludeRouter"
import { runCommand } from "./runCommand"

export async function build(options: Record<string, string>, { args }: Command) {
    await excludeRouter()

    await createRouter()

    if (args.length === 0) return

    process.exitCode = await runCommand({ args })
}
