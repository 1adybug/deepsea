import { mkdir, readFile, readdir, rm, writeFile } from "fs/promises"
import { dirname, join, parse, relative } from "path"

export interface SharedModuleInfo {
    dir: string
    ext: string
    importPath: string
    name: string
    relativePath: string
}

export interface GeneratedFileParams {
    content: string
    path: string
}

export interface RemoveGeneratedFileParams {
    path: string
    stopPath?: string
}

export const scriptModuleExtensions = [".ts", ".tsx", ".js", ".jsx"]

export function normalizePathSeparator(path: string) {
    return path.replace(/\\/g, "/")
}

export function isScriptModule(path: string) {
    const { ext } = parse(path)
    return scriptModuleExtensions.includes(ext)
}

export function normalizeSharedPath(path: string) {
    return normalizePathSeparator(relative("shared", path))
}

export function getSharedModuleInfo(path: string): SharedModuleInfo {
    const relativePath = normalizeSharedPath(path)
    const { dir, name, ext } = parse(relativePath)

    return {
        dir,
        ext,
        importPath: normalizePathSeparator(join(dir, name)),
        name,
        relativePath,
    }
}

export function toKebabCase(name: string) {
    return name
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .toLowerCase()
}

export async function writeGeneratedFile({ content, path }: GeneratedFileParams) {
    try {
        const current = await readFile(path, "utf-8")

        if (current === content) return
    } catch (error) {}

    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, content)
}

export async function removeGeneratedFile({ path, stopPath }: RemoveGeneratedFileParams) {
    await rm(path, { force: true, recursive: true })

    if (!stopPath) return

    await removeEmptyDirectories(dirname(path), stopPath)
}

async function removeEmptyDirectories(path: string, stopPath: string) {
    let currentPath = path

    while (currentPath !== stopPath && currentPath !== "." && currentPath !== dirname(currentPath)) {
        try {
            const content = await readdir(currentPath)
            if (content.length > 0) return
        } catch (error) {
            return
        }

        await rm(currentPath, { force: true, recursive: true })
        currentPath = dirname(currentPath)
    }
}
