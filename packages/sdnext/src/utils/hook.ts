import { mkdir, readdir, readFile, stat, writeFile } from "fs/promises"
import { join, parse, relative } from "path"
import { cwd } from "process"

import { checkbox, select } from "@inquirer/prompts"
import { Command } from "commander"

import { readSdNextSetting, SdNextSetting } from "./readSdNextSetting"
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
    if (content.includes("IdOrParams")) return "get"
    if (content.includes("useQuery")) return "query"
    return undefined
}

export interface HookData extends HookContentMap {
    overwrite: boolean
    type: HookType
}

export async function createHook(path: string, hookMap: Record<string, HookData>) {
    path = relative("actions", path).replace(/\\/g, "/")
    const { dir, name, ext, base } = parse(path)
    if (ext !== ".ts" && ext !== ".tsx" && ext !== ".js" && ext !== ".jsx") return
    const actionContent = await readFile(join("actions", path), "utf-8")
    const match = actionContent.match(/^import { (.+Schema) } from "@\/schemas\/.+"$/m)
    const hasSchema = !!match
    const upName = name.replace(/^./, char => char.toUpperCase())
    const key = name.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)

    const mutationHook = `import { useId } from "react"

import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { createRequestFn } from "deepsea-tools"

import { ${name}Action } from "@/actions/${join(dir, name)}"
${
    hasSchema
        ? `
${match[0]}
`
        : ""
}
export const ${name}Client = createRequestFn(${
        hasSchema
            ? `{
    fn: ${name}Action,
    schema: ${match[1]},
}`
            : `{
    fn: ${name}Action,
}`
    })

export interface Use${upName}Params<TOnMutateResult = unknown> extends Omit<
    UseMutationOptions<Awaited<ReturnType<typeof ${name}Client>>, Error, Parameters<typeof ${name}Client>[0], TOnMutateResult>,
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

import { ${name}Action } from "@/actions/${join(dir, name)}"
${
    hasSchema
        ? `
${match[0].replace(match[1], `${match[1].replace(/Schema$/, "Params").replace(/^./, char => char.toUpperCase())}, ${match[1]}`)}
`
        : ""
}
export const ${name}Client = createRequestFn(${
        hasSchema
            ? `{
    fn: ${name}Action,
    schema: ${match[1]},
}`
            : `{
    fn: ${name}Action,
}`
    })

export function ${name}ClientOptional(id?: ${hasSchema ? `${match[1].replace(/Schema$/, "Params").replace(/^./, char => char.toUpperCase())} | ` : ""}undefined) {
    return isNonNullable(id) ? ${name}Client(id) : null
}

export const use${upName} = createUseQuery({
    queryFn: ${name}ClientOptional,
    queryKey: "${key}",
})
`

    const queryHook = `import { createRequestFn } from "deepsea-tools"
import { createUseQuery } from "soda-tanstack-query"

import { ${name}Action } from "@/actions/${join(dir, name)}"
${
    hasSchema
        ? `
${match[0]}
`
        : ""
}
export const ${name}Client = createRequestFn(${
        hasSchema
            ? `{
    fn: ${name}Action,
    schema: ${match[1]},
}`
            : `{
    fn: ${name}Action,
}`
    })

export const use${upName} = createUseQuery({
    queryFn: ${name}Client,
    queryKey: "${key}",
})
`

    const map: HookContentMap = {
        get: getHook,
        query: queryHook,
        mutation: mutationHook,
    }

    const hookName = base.replace(/^./, char => `use${char.toUpperCase()}`)

    const hookPath = join("hooks", dir, hookName)

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
        overwrite,
        type: hookType,
        ...map,
    }
}

export async function createActionFromFolder() {
    const map: Record<string, HookData> = {}

    async function _createActionFromFolder(dir: string) {
        const content = await readdir(dir)

        for (const item of content) {
            const path = join(dir, item)
            const stats = await stat(path)

            if (stats.isDirectory()) await _createActionFromFolder(path)
            if (stats.isFile()) await createHook(path, map)
        }
    }

    await _createActionFromFolder("actions")

    return map
}

export async function hook(options: Record<string, string>, { args }: Command) {
    const map = await createActionFromFolder()

    const entires = Object.entries(map)

    if (entires.length === 0) {
        console.log("All hooks are the latest.")
        return
    }

    const newEntires = entires.filter(([path, { overwrite }]) => overwrite)

    const oldEntires = entires.filter(([path, { overwrite }]) => !overwrite)

    const root = cwd()

    const setting = await getSetting()

    for await (const [path, { overwrite, type, ...map }] of newEntires) {
        const resolved = join(root, "hooks", path)

        const answer = await select<OperationType>({
            message: path,
            choices: ["mutation", "query", "get", "skip"],
            default: setting.hook?.[resolved] ?? type,
        })

        setting.hook ??= {}
        setting.hook[resolved] = answer

        if (answer === "skip") continue

        const { dir, base } = parse(path)
        await mkdir(join("hooks", dir), { recursive: true })
        await writeFile(
            join(
                "hooks",
                dir,
                base.replace(/^./, char => `use${char.toUpperCase()}`),
            ),
            map[answer],
        )
    }

    await writeSdNextSetting(setting)

    const overwrites = await checkbox<string>({
        message: "Please check the hooks you want to overwrite",
        choices: oldEntires.map(([key]) => key),
    })

    for (const [path, { overwrite, type, ...map }] of oldEntires) {
        if (!overwrites.includes(path)) continue

        const { dir, base } = parse(path)
        await mkdir(join("hooks", dir), { recursive: true })
        await writeFile(
            join(
                "hooks",
                dir,
                base.replace(/^./, char => `use${char.toUpperCase()}`),
            ),
            map[type],
        )
    }
}
