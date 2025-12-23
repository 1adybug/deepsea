import { spawn } from "child_process"
import { readdir, stat } from "fs/promises"
import { join } from "path"

import { Command } from "commander"

import { createAction } from "./createAction"
import { excludeActions } from "./excludeActions"

export async function buildFolder(dir: string) {
    const content = await readdir(dir)

    for (const item of content) {
        const path = join(dir, item)
        const stats = await stat(path)

        if (stats.isDirectory()) await buildFolder(path)
        else await createAction(path)
    }
}

export async function build(options: Record<string, string>, { args }: Command) {
    await excludeActions()

    await buildFolder("shared")

    if (args.length === 0) return

    spawn(args.at(0)!, args.slice(1), {
        stdio: "inherit",
        shell: true,
    })
}
