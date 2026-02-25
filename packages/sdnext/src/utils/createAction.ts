import { mkdir, readFile, writeFile } from "fs/promises"
import { join, parse, relative } from "path"

export async function createAction(path: string) {
    path = relative("shared", path).replace(/\\/g, "/")
    const { dir, name, ext } = parse(path)
    if (ext !== ".ts" && ext !== ".tsx" && ext !== ".js" && ext !== ".jsx") return

    const content = `"use server"

import { createResponseFn } from "@/server/createResponseFn"

import { ${name} } from "@/shared/${join(dir, name)}"

export const ${name}Action = createResponseFn(${name})
`

    const actionPath = join("actions", path)

    try {
        const current = await readFile(actionPath, "utf-8")
        if (current === content) return
    } catch (error) {}

    await mkdir(join("actions", dir), { recursive: true })

    await writeFile(actionPath, content)
}
