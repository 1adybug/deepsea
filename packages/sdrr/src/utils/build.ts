import { Command } from "commander"

import { runCommand } from "./runCommand"
import { syncRouter } from "./syncRouter"

export async function build(options: Record<string, string>, { args }: Command) {
    await syncRouter({
        updateVsCodeSettings: true,
    })

    if (args.length === 0) return

    process.exitCode = await runCommand({ args })
}
