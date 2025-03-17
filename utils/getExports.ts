import { readFile, readdir, stat } from "fs/promises"
import { join } from "path"

export async function getExports() {
    const dir = await readdir("src")
    const exports: string[] = []
    for (const item of dir) {
        const folder = join("src", item)
        const status = await stat(folder)
        if (!status.isDirectory()) continue
        const files = await readdir(folder)
        for (const file of files) {
            const status2 = await stat(join(folder, file))
            if (!status2.isFile()) continue
            if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue
            const content = await readFile(join(folder, file), "utf-8")
            const variables = Array.from(content.matchAll(/^export (const|let|var|function|class) (\w+)/gm))
                .map(v => v[2])
                .filter((item, index, array) => array.indexOf(item) === index)
                .toSorted()
            if (variables.length > 0) exports.push(`export { ${variables.join(", ")} } from "@/${item}/${file.replace(/\.tsx?$/, "")}"`)
            const types = Array.from(content.matchAll(/^export (type|interface) (\w+)/gm))
                .map(v => v[2])
                .filter((item, index, array) => array.indexOf(item) === index)
                .toSorted().filter(item => !variables.includes(item))
            if (types.length > 0) exports.push(`export type { ${types.join(", ")} } from "@/${item}/${file.replace(/\.tsx?$/, "")}"`)
        }
    }
    return exports
}
