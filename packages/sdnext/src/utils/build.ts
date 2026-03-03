import { readdir, stat } from "fs/promises"
import { join } from "path"

import { Command } from "commander"

import { excludeGeneratedFiles } from "./excludeGeneratedFiles"
import { runCommand } from "./runCommand"
import { syncSharedArtifacts } from "./syncSharedArtifacts"

export async function buildFolder(dir: string) {
    const content = await readdir(dir)

    for (const item of content) {
        const path = join(dir, item)
        const stats = await stat(path)

        if (stats.isDirectory()) await buildFolder(path)
        else await syncSharedArtifacts(path)
    }
}

export async function build(options: Record<string, string>, { args }: Command) {
    await excludeGeneratedFiles()

    await buildFolder("shared")

    if (args.length === 0) return

    process.exitCode = await runCommand({ args })
}
