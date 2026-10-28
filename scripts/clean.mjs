import { rm } from "node:fs/promises"
import { dirname, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const packageRoot = process.cwd()
const packagePath = relative(workspaceRoot, packageRoot).split(sep)
if (packagePath.length !== 2 || !["apps", "packages", "compat"].includes(packagePath[0]) || packagePath[1] === "xlsx")
    throw new Error("Clean must run inside an owned application or library package")

for (const directory of ["dist", ".turbo", "coverage"]) {
    const target = resolve(packageRoot, directory)
    if (!target.startsWith(packageRoot + sep)) throw new Error(`Unsafe clean target: ${target}`)
    await rm(target, { recursive: true, force: true })
}
