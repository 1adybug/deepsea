import { copyFile, readFile, writeFile } from "fs/promises"
import { join } from "path"

async function main() {
    await copyFile(join("src", "robust-point-in-polygon.d.ts"), join("dist", "robust-point-in-polygon.d.ts"))
    await copyFile(join("src", "robust-segment-intersect.d.ts"), join("dist", "robust-segment-intersect.d.ts"))
    const content = await readFile(join("dist", "index.d.ts"), "utf-8")
    await writeFile(
        join("dist", "index.d.ts"),
        `/// <reference types="./robust-point-in-polygon" />
/// <reference types="./robust-segment-intersect" />

${content}`,
        "utf-8",
    )
}

main()
