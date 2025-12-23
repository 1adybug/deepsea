import { mkdir, readFile, writeFile } from "fs/promises"
import { join, parse, relative } from "path"

import { isNonNullable } from "deepsea-tools"

export async function createAction(path: string) {
    path = relative("shared", path).replace(/\\/g, "/")
    const { dir, name, ext } = parse(path)
    if (ext !== ".ts" && ext !== ".tsx" && ext !== ".js" && ext !== ".jsx") return
    const serverContent = await readFile(join("shared", path), "utf-8")
    const match = serverContent.match(new RegExp(`export async function ${name}\\(.+?: (.+?)Params\\)`, "s"))
    const schema = match?.[1].replace(/^./, char => char.toLowerCase())
    const hasSchema = isNonNullable(schema) && serverContent.includes(`from "@/schemas/${schema}"`)

    const content = `"use server"
${
    hasSchema
        ? `
import { ${schema}Schema } from "@/schemas/${schema}"
`
        : ""
}
import { createResponseFn } from "@/server/createResponseFn"

import { ${name} } from "@/shared/${join(dir, name)}"

export const ${name}Action = createResponseFn({
    fn: ${name},${
        hasSchema
            ? `
    schema: ${schema}Schema,`
            : ""
    }
    name: "${name}",
})
`

    const actionPath = join("actions", path)

    try {
        const current = await readFile(actionPath, "utf-8")
        if (current === content) return
    } catch (error) {}

    await mkdir(join("actions", dir), { recursive: true })

    await writeFile(actionPath, content)
}
