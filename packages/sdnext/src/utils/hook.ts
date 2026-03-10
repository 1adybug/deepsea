import { readdir, readFile, stat } from "fs/promises"
import { join, parse, relative } from "path"
import { cwd } from "process"

import { checkbox, select } from "@inquirer/prompts"
import { Command } from "commander"

import { readSdNextSetting, SdNextSetting } from "./readSdNextSetting"
import { resolveProjectImportPath } from "./resolveProjectImportPath"
import { isScriptModule, normalizePathSeparator, writeGeneratedFile } from "./sharedArtifact"
import { writeSdNextSetting } from "./writeSdNextSetting"

export type HookType = "get" | "query" | "mutation"

export type OperationType = HookType | "skip"

export type HookContentMap = Record<HookType, string>

function getHookTypeFromName(name: string): HookType {
    if (/^get[^a-z]/.test(name)) return "get"
    if (/^query[^a-z]/.test(name)) return "query"
    return "mutation"
}

let setting: SdNextSetting = {}

async function getSetting() {
    setting = await readSdNextSetting()
    return setting
}

async function getHookTypeFromContent(path: string, content: string): Promise<HookType | undefined> {
    const setting = await getSetting()
    const type = setting.hook?.[path]
    if (type !== undefined && type !== "skip") return type
    if (content.includes("useMutation")) return "mutation"
    if (content.includes("createUse") && /from\s+["'][^"']*\/presets\//.test(content)) return "mutation"
    if (content.includes("ClientOptional")) return "get"
    if (content.includes("useQuery")) return "query"
    return undefined
}

export interface HookData extends HookContentMap {
    hookPath: string
    mutationPreset: string
    mutationPresetPath: string
    overwrite: boolean
    type: HookType
}

export interface GeneratedFileState {
    content: string
    overwrite: boolean
}

async function getGeneratedFileState(path: string): Promise<GeneratedFileState> {
    try {
        const content = await readFile(path, "utf-8")

        return {
            content,
            overwrite: !content.trim(),
        }
    } catch (error) {
        return {
            content: "",
            overwrite: true,
        }
    }
}

export async function createHook(path: string, hookMap: Record<string, HookData>) {
    path = relative("actions", path).replace(/\\/g, "/")
    const { dir, name, base } = parse(path)
    if (!isScriptModule(path)) return
    const upName = name.replace(/^./, char => char.toUpperCase())
    const key = name.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)
    const actionImportPath = normalizePathSeparator(join(dir, name))
    const hookName = base.replace(/^./, char => `use${char.toUpperCase()}`)
    const hookPath = join("hooks", dir, hookName)
    const mutationPresetName = `createUse${upName}.ts`
    const mutationPresetPath = join("presets", dir, mutationPresetName)
    const mutationPresetImportPath = normalizePathSeparator(join(dir, `createUse${upName}`))
    const clientInputType = `${upName}ClientInput`
    const actionPath = normalizePathSeparator(join("actions", actionImportPath))
    const hookActionImportPath = await resolveProjectImportPath(hookPath, actionPath)
    const hookPresetImportPath = await resolveProjectImportPath(hookPath, normalizePathSeparator(join("presets", mutationPresetImportPath)))
    const mutationPresetSharedImportPath = await resolveProjectImportPath(mutationPresetPath, normalizePathSeparator(join("shared", actionImportPath)))

    const mutationHook = `import { createRequestFn } from "deepsea-tools"

import { ${name}Action } from "${hookActionImportPath}"

import { createUse${upName} } from "${hookPresetImportPath}"

export const ${name}Client = createRequestFn(${name}Action)

export const use${upName} = createUse${upName}(${name}Client)
`

    const mutationPreset = `import { useId } from "react"

import { withUseMutationDefaults } from "soda-tanstack-query"

import { ${name} } from "${mutationPresetSharedImportPath}"

export const createUse${upName} = withUseMutationDefaults<typeof ${name}>(() => {
    const key = useId()

    return {
        onMutate(variables, context) {
            message.open({
                key,
                type: "loading",
                content: "中...",
                duration: 0,
            })
        },
        onSuccess(data, variables, onMutateResult, context) {
            context.client.invalidateQueries({ queryKey: ["query-${key.replace(/^.+?-/, "")}"] })
            context.client.invalidateQueries({ queryKey: ["get-${key.replace(/^.+?-/, "")}", data.id] })

            message.open({
                key,
                type: "success",
                content: "成功",
            })
        },
        onError(error, variables, onMutateResult, context) {
            message.destroy(key)
        },
        onSettled(data, error, variables, onMutateResult, context) {},
    }
})
`

    const getHook = `import { createRequestFn, isNonNullable } from "deepsea-tools"
import { createUseQuery } from "soda-tanstack-query"

import { ${name}Action } from "${hookActionImportPath}"

export const ${name}Client = createRequestFn(${name}Action)

export type ${clientInputType} = Parameters<typeof ${name}Client> extends [] ? undefined : Parameters<typeof ${name}Client>[0]

export function ${name}ClientOptional(id?: ${clientInputType} | null) {
    return isNonNullable(id) ? ${name}Client(id) : null
}

export const use${upName} = createUseQuery({
    queryKey: "${key}",
    queryFn: ${name}ClientOptional,
})
`

    const queryHook = `import { createRequestFn } from "deepsea-tools"
import { createUseQuery } from "soda-tanstack-query"

import { ${name}Action } from "${hookActionImportPath}"

export const ${name}Client = createRequestFn(${name}Action)

export const use${upName} = createUseQuery({
    queryKey: "${key}",
    queryFn: ${name}Client,
})
`

    const map: HookContentMap = {
        get: getHook,
        query: queryHook,
        mutation: mutationHook,
    }

    let hookType = getHookTypeFromName(name)
    const hookState = await getGeneratedFileState(hookPath)

    const contentType = await getHookTypeFromContent(join(cwd(), hookPath), hookState.content)
    if (contentType) hookType = contentType

    if (hookType === "mutation") {
        const mutationPresetState = await getGeneratedFileState(mutationPresetPath)

        if (map[hookType] === hookState.content && mutationPreset === mutationPresetState.content) return

        hookMap[path] = {
            hookPath,
            mutationPreset,
            mutationPresetPath,
            overwrite: hookState.overwrite && mutationPresetState.overwrite,
            type: hookType,
            ...map,
        }

        return
    }

    if (map[hookType] === hookState.content) return

    hookMap[path] = {
        hookPath,
        mutationPreset,
        mutationPresetPath,
        overwrite: hookState.overwrite,
        type: hookType,
        ...map,
    }
}

export async function createHookFromFolder() {
    const map: Record<string, HookData> = {}

    async function _createHookFromFolder(dir: string) {
        const content = await readdir(dir)

        for (const item of content) {
            const path = join(dir, item)
            const stats = await stat(path)

            if (stats.isDirectory()) await _createHookFromFolder(path)
            if (stats.isFile()) await createHook(path, map)
        }
    }

    try {
        await _createHookFromFolder("actions")
    } catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") return map
        throw error
    }

    return map
}

export async function hook(options: Record<string, string>, { args }: Command) {
    const map = await createHookFromFolder()

    const entires = Object.entries(map)

    if (entires.length === 0) {
        console.log("All hooks are the latest.")
        return
    }

    const newEntires = entires.filter(([path, { overwrite }]) => overwrite)

    const oldEntires = entires.filter(([path, { overwrite }]) => !overwrite)

    const root = cwd()

    const setting = await getSetting()

    for (const [path, { hookPath, mutationPresetPath, mutationPreset, overwrite, type, ...map }] of newEntires) {
        const resolved = join(root, hookPath)

        const answer = await select<OperationType>({
            message: path,
            choices: ["mutation", "query", "get", "skip"],
            default: setting.hook?.[resolved] ?? type,
        })

        setting.hook ??= {}
        setting.hook[resolved] = answer

        if (answer === "skip") continue

        await writeGeneratedFile({
            path: hookPath,
            content: map[answer],
        })

        if (answer !== "mutation") continue

        await writeGeneratedFile({
            path: mutationPresetPath,
            content: mutationPreset,
        })
    }

    await writeSdNextSetting(setting)

    const overwrites = await checkbox<string>({
        message: "Please check the hooks you want to overwrite",
        choices: oldEntires.map(([key]) => key),
    })

    for (const [path, { hookPath, mutationPresetPath, mutationPreset, overwrite, type, ...map }] of oldEntires) {
        if (!overwrites.includes(path)) continue

        await writeGeneratedFile({
            path: hookPath,
            content: map[type],
        })

        if (type !== "mutation") continue

        await writeGeneratedFile({
            path: mutationPresetPath,
            content: mutationPreset,
        })
    }
}

export interface NodeError {
    code?: string
}

function isNodeError(error: unknown): error is NodeError {
    return typeof error === "object" && error !== null
}
