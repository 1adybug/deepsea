import { readdir, readFile, stat } from "fs/promises"
import { join, parse, relative } from "path"
import { cwd } from "process"

import { checkbox, select } from "@inquirer/prompts"
import { Command } from "commander"

import { readSdNextSetting, SdNextSetting } from "./readSdNextSetting"
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
    if (content.includes("ClientOptional")) return "get"
    if (content.includes("useQuery")) return "query"
    return undefined
}

export interface HookData extends HookContentMap {
    hookPath: string
    overwrite: boolean
    type: HookType
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
    const clientInputType = `${upName}ClientInput`

    const mutationHook = `import { useId } from "react"

import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { createRequestFn } from "deepsea-tools"

import { ${name}Action } from "@/actions/${actionImportPath}"

export const ${name}Client = createRequestFn(${name}Action)

export type ${clientInputType} = Parameters<typeof ${name}Client> extends [] ? void : Parameters<typeof ${name}Client>[0]

export interface Use${upName}Params<TOnMutateResult = unknown> extends Omit<
    UseMutationOptions<Awaited<ReturnType<typeof ${name}Client>>, Error, ${clientInputType}, TOnMutateResult>,
    "mutationFn"
> {}

export function use${upName}<TOnMutateResult = unknown>({ onMutate, onSuccess, onError, onSettled, ...rest }: Use${upName}Params<TOnMutateResult> = {}) {
    const key = useId()

    return useMutation({
        mutationFn: ${name}Client,
        onMutate(variables, context) {
            message.open({
                key,
                type: "loading",
                content: "中...",
                duration: 0,
            })

            return onMutate?.(variables, context) as TOnMutateResult | Promise<TOnMutateResult>
        },
        onSuccess(data, variables, onMutateResult, context) {
            context.client.invalidateQueries({ queryKey: ["query-${key.replace(/^.+?-/, "")}"] })
            context.client.invalidateQueries({ queryKey: ["get-${key.replace(/^.+?-/, "")}", data.id] })

            message.open({
                key,
                type: "success",
                content: "成功",
            })

            return onSuccess?.(data, variables, onMutateResult, context)
        },
        onError(error, variables, onMutateResult, context) {
            message.destroy(key)

            return onError?.(error, variables, onMutateResult, context)
        },
        onSettled(data, error, variables, onMutateResult, context) {
            return onSettled?.(data, error, variables, onMutateResult, context)
        },
        ...rest,
    })
}
`

    const getHook = `import { createRequestFn, isNonNullable } from "deepsea-tools"
import { createUseQuery } from "soda-tanstack-query"

import { ${name}Action } from "@/actions/${actionImportPath}"

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

import { ${name}Action } from "@/actions/${actionImportPath}"

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
    let overwrite = true

    try {
        const current = await readFile(hookPath, "utf-8")
        if (current.trim()) overwrite = false
        const contentType = await getHookTypeFromContent(join(cwd(), hookPath), current)
        if (contentType) hookType = contentType
        if (map[hookType] === current) return
    } catch (error) {
        overwrite = true
    }

    hookMap[path] = {
        hookPath,
        overwrite,
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

    for (const [path, { hookPath, overwrite, type, ...map }] of newEntires) {
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
    }

    await writeSdNextSetting(setting)

    const overwrites = await checkbox<string>({
        message: "Please check the hooks you want to overwrite",
        choices: oldEntires.map(([key]) => key),
    })

    for (const [path, { hookPath, overwrite, type, ...map }] of oldEntires) {
        if (!overwrites.includes(path)) continue

        await writeGeneratedFile({
            path: hookPath,
            content: map[type],
        })
    }
}

export interface NodeError {
    code?: string
}

function isNodeError(error: unknown): error is NodeError {
    return typeof error === "object" && error !== null
}
