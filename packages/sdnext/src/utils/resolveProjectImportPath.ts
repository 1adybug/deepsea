import { constants } from "node:fs"
import { access, readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, isAbsolute, join, normalize, relative, resolve } from "node:path"
import { cwd } from "node:process"

import { normalizePathSeparator } from "./sharedArtifact"

const require = createRequire(import.meta.url)

const projectRoot = cwd()

let rootAliasPromise: Promise<string | undefined> | undefined

export async function resolveProjectImportPath(fromPath: string, targetPath: string) {
    const normalizedTargetPath = normalizePathSeparator(targetPath).replace(/^\.?\//, "")
    const rootAlias = await getProjectRootAlias()

    if (rootAlias) return `${rootAlias}/${normalizedTargetPath}`

    return getRelativeImportPath(fromPath, normalizedTargetPath)
}

function getRelativeImportPath(fromPath: string, targetPath: string) {
    const fromDir = dirname(fromPath)
    let importPath = normalizePathSeparator(relative(fromDir, targetPath))

    if (!importPath.startsWith(".")) importPath = `./${importPath}`

    return importPath
}

async function getProjectRootAlias() {
    rootAliasPromise ??= resolveProjectRootAlias()
    return rootAliasPromise
}

async function resolveProjectRootAlias() {
    const configPath = await findProjectConfigPath(projectRoot)
    if (!configPath) return undefined

    return readRootAliasFromConfig(configPath, new Set())
}

async function findProjectConfigPath(path: string) {
    const candidates = [join(path, "tsconfig.json"), join(path, "jsconfig.json")]

    for (const candidate of candidates) {
        if (await exists(candidate)) return candidate
    }

    return undefined
}

async function readRootAliasFromConfig(configPath: string, seen: Set<string>): Promise<string | undefined> {
    const normalizedPath = normalize(configPath)
    if (seen.has(normalizedPath)) return undefined
    seen.add(normalizedPath)

    const config = await readJsonConfig(configPath)
    const compilerOptions = toObject(config.compilerOptions)
    const configDir = dirname(configPath)
    const baseDir = getBaseDir(configDir, compilerOptions.baseUrl)
    const paths = toPathMap(compilerOptions.paths)

    if (paths) {
        const rootAlias = findRootAlias(paths, baseDir, projectRoot)
        if (rootAlias) return rootAlias
    }

    const extendsValue = typeof config.extends === "string" ? config.extends : undefined
    if (!extendsValue) return undefined

    const extendsPath = await resolveExtendsPath(extendsValue, configDir)
    if (!extendsPath) return undefined

    return readRootAliasFromConfig(extendsPath, seen)
}

function getBaseDir(configDir: string, baseUrl: unknown) {
    if (typeof baseUrl !== "string") return configDir
    return resolve(configDir, baseUrl)
}

function findRootAlias(paths: Record<string, string[]>, baseDir: string, rootDir: string) {
    for (const [key, targets] of Object.entries(paths)) {
        const alias = getAliasName(key)
        if (!alias) continue

        for (const target of targets) {
            if (!isRootTarget(target, baseDir, rootDir)) continue
            return alias
        }
    }

    return undefined
}

function getAliasName(pattern: string) {
    const wildcard = splitWildcard(pattern)
    if (!wildcard || wildcard.suffix.length > 0) return undefined

    const aliasPrefix = wildcard.prefix.replace(/\/$/, "")
    if (!aliasPrefix) return undefined

    return aliasPrefix
}

function isRootTarget(pattern: string, baseDir: string, rootDir: string) {
    const wildcard = splitWildcard(pattern)
    if (!wildcard || wildcard.suffix.length > 0) return false

    const targetPath = resolve(baseDir, wildcard.prefix || ".")

    return normalizeForComparison(targetPath) === normalizeForComparison(rootDir)
}

function splitWildcard(value: string) {
    const index = value.indexOf("*")
    if (index < 0) return undefined
    if (value.indexOf("*", index + 1) >= 0) return undefined

    return {
        prefix: value.slice(0, index),
        suffix: value.slice(index + 1),
    }
}

async function resolveExtendsPath(extendsValue: string, baseDir: string) {
    if (isAbsolute(extendsValue) || extendsValue.startsWith(".")) {
        const relativeCandidates = getRelativeCandidates(resolve(baseDir, extendsValue))
        for (const candidate of relativeCandidates) {
            if (await exists(candidate)) return candidate
        }

        return undefined
    }

    const moduleCandidates = getModuleCandidates(extendsValue)

    for (const candidate of moduleCandidates) {
        try {
            return require.resolve(candidate, { paths: [baseDir] })
        } catch (error) {}
    }

    return undefined
}

function getRelativeCandidates(path: string) {
    if (path.endsWith(".json")) return [path]
    return [path, `${path}.json`]
}

function getModuleCandidates(path: string) {
    if (path.endsWith(".json")) return [path]
    return [path, `${path}.json`]
}

async function readJsonConfig(path: string): Promise<JsonObject> {
    const content = await readFile(path, "utf-8")
    const parsed = JSON.parse(stripTrailingCommas(stripComments(content)))
    return toObject(parsed)
}

function stripComments(content: string) {
    const output: string[] = []
    let inString = false
    let escaped = false

    for (let index = 0; index < content.length; index++) {
        const char = content[index]
        const next = content[index + 1]

        if (inString) {
            output.push(char)
            if (escaped) {
                escaped = false
                continue
            }

            if (char === "\\") {
                escaped = true
                continue
            }

            if (char === "\"") inString = false

            continue
        }

        if (char === "\"") {
            inString = true
            output.push(char)
            continue
        }

        if (char === "/" && next === "/") {
            while (index < content.length && content[index] !== "\n") index++
            output.push("\n")
            continue
        }

        if (char === "/" && next === "*") {
            index += 2
            while (index < content.length && !(content[index] === "*" && content[index + 1] === "/")) index++
            index++
            continue
        }

        output.push(char)
    }

    return output.join("").replace(/^\uFEFF/, "")
}

function stripTrailingCommas(content: string) {
    return content.replace(/,\s*([}\]])/g, "$1")
}

function toPathMap(value: unknown): Record<string, string[]> | undefined {
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined

    const entries: [string, string[]][] = []

    for (const [key, item] of Object.entries(value)) {
        if (!Array.isArray(item)) continue
        const list = item.filter((target): target is string => typeof target === "string")
        if (list.length === 0) continue
        entries.push([key, list])
    }

    if (entries.length === 0) return undefined

    return Object.fromEntries(entries)
}

function toObject(value: unknown): JsonObject {
    if (value && typeof value === "object" && !Array.isArray(value)) return value as JsonObject
    return {}
}

async function exists(path: string) {
    try {
        await access(path, constants.F_OK)
        return true
    } catch (error) {
        return false
    }
}

function normalizeForComparison(path: string) {
    return normalize(path).replace(/\\/g, "/").replace(/\/$/, "").toLowerCase()
}

type JsonObject = Record<string, unknown>
