import { readFile, writeFile } from "fs/promises"
import { join } from "path"

export async function clearReference(path: string) {
    const content = await readFile(path, "utf-8")
    const newContent = content.replace(/^\/\/\/ <reference path="\.\.\/.+?$\n/gm, "")
    await writeFile(path, newContent, "utf-8")
}

async function main() {
    await clearReference(join("dist", "cjs", "index.d.ts"))
    await clearReference(join("dist", "esm", "index.d.ts"))
}

main()
