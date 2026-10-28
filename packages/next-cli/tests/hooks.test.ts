import { expect, it, vi } from "vitest"

import { type HookData, createHook } from "../src/utils/hook"

import { compileGeneratedFiles } from "../../../tests/generator-contracts"

vi.mock("node:fs/promises", async importOriginal => ({
    ...(await importOriginal<object>()),
    readFile: vi.fn(async () => {
        throw Object.assign(new Error("missing"), { code: "ENOENT" })
    }),
}))

vi.mock("../src/utils/readSdNextSetting", () => ({ readSdNextSetting: async () => ({}) }))

vi.mock("../src/utils/resolveProjectImportPath", () => ({
    resolveProjectImportPath: async (from: string, target: string) => {
        const { dirname, relative } = await import("node:path")
        const path = relative(dirname(from), target).replaceAll("\\", "/")
        return path.startsWith(".") ? path : "./" + path
    },
}))

it("generates get, query and mutation hooks that compile against the real libraries", async () => {
    const map: Record<string, HookData> = {}

    await createHook("actions/getCount.ts", map)
    await createHook("actions/queryItems.ts", map)
    await createHook("actions/saveItem.ts", map)
    await createHook("actions/deleteAll.ts", map)
    await createHook("actions/queryConstant.ts", map)

    const files: Record<string, string> = {
        "actions/getCount.ts": "export const getCountAction = async (id: number) => ({ success: true, data: id })",
        "actions/queryItems.ts": "export const queryItemsAction = async (params?: { page: number }) => ({ success: true, data: [params?.page ?? 1] })",
        "actions/saveItem.ts": "export const saveItemAction = async (input: { id: number }) => ({ success: true, data: { id: input.id } })",
        "actions/deleteAll.ts": "export const deleteAllAction = async () => ({ success: true })",
        "actions/queryConstant.ts": "export const queryConstantAction = async () => ({ success: true, data: 1 })",
    }

    for (const item of Object.values(map)) {
        files[item.hookPath] = item[item.type]
        if (item.type === "mutation") files[item.mutationPresetPath] = item.mutationPreset
    }

    expect(map["getCount.ts"].type).toBe("get")
    expect(map["queryItems.ts"].type).toBe("query")
    expect(map["saveItem.ts"].type).toBe("mutation")
    expect(map["saveItem.ts"].mutationPreset).not.toContain("message.")
    await compileGeneratedFiles(files)
}, 20_000)

it("ignores non-script files without creating a hook candidate", async () => {
    const map: Record<string, HookData> = {}

    await createHook("actions/logo.png", map)
    expect(map).toEqual({})
})
