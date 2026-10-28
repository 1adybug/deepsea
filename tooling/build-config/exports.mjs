import { readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

/** @param {string} [root] */
export async function getExports(root = process.cwd()) {
    const sourceDir = join(root, "src")
    const directories = await readdir(sourceDir, { withFileTypes: true })

    const exports = []

    for (const directory of directories.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
        if (!directory.isDirectory()) continue
        const files = await readdir(join(sourceDir, directory.name), { withFileTypes: true })

        for (const file of files.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))) {
            if (!file.isFile() || !/\.tsx?$/.test(file.name) || /\.d\.ts$|\.(test|spec)\.tsx?$/.test(file.name)) continue
            exports.push(`export * from "@/${directory.name}/${file.name.replace(/\.tsx?$/, "")}"`)
        }
    }

    return exports
}

/**
 * Avoid changing mtimes on identical output, so watch builds converge.
 * @param {string} file
 * @param {string} code
 */
export async function writeCode(file, code) {
    const content = code + "\n"
    let previous

    try {
        previous = await readFile(file, "utf8")
    } catch (error) {
        if (error.code !== "ENOENT") throw error
    }

    if (previous !== content) await writeFile(file, content, "utf8")
}
