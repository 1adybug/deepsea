import { expect, it, vi } from "vitest"

import { type HookData, createHook } from "../src/utils/hook"

import { compileGeneratedFiles } from "../../../tests/generator-contracts"

vi.mock("node:fs/promises", async importOriginal => ({
    ...(await importOriginal<object>()),
    readFile: vi.fn(async () => {
        throw Object.assign(new Error("missing"), { code: "ENOENT" })
    }),
}))

vi.mock("../src/utils/readSdrrSetting", () => ({ readSdrrSetting: async () => ({}) }))

vi.mock("../src/utils/resolveProjectImportPath", () => ({
    resolveProjectImportPath: async (from: string, target: string) => {
        const { dirname, relative } = await import("node:path")
        const path = relative(dirname(from), target).replaceAll("\\", "/")
        return path.startsWith(".") ? path : "./" + path
    },
}))

it("generates hooks with numeric query inputs and self-contained mutation callbacks", async () => {
    const map: Record<string, HookData> = {}

    await createHook("apis/getCount.ts", map)
    await createHook("apis/queryItems.ts", map)
    await createHook("apis/saveItem.ts", map)
    await createHook("apis/deleteAll.ts", map)
    await createHook("apis/queryConstant.ts", map)
    expect(map["getCount.ts"].type).toBe("get")
    expect(map["saveItem.ts"].mutation).not.toContain("message.")
    await compileGeneratedFiles({
        "apis/getCount.ts": "export const getCount = async (id: number) => id",
        "apis/queryItems.ts": "export const queryItems = async (params?: { page: number }) => [params?.page ?? 1]",
        "apis/saveItem.ts": "export const saveItem = async (input: { id: number }) => ({ id: input.id })",
        "apis/deleteAll.ts": "export const deleteAll = async () => {}",
        "apis/queryConstant.ts": "export const queryConstant = async () => 1",
        "hooks/useGetCount.ts": map["getCount.ts"].get,
        "hooks/useQueryItems.ts": map["queryItems.ts"].query,
        "hooks/useSaveItem.ts": map["saveItem.ts"].mutation,
        "hooks/useDeleteAll.ts": map["deleteAll.ts"].mutation,
        "hooks/useQueryConstant.ts": map["queryConstant.ts"].query,
    })
}, 20_000)

it("ignores asset files while collecting hook candidates", async () => {
    const map: Record<string, HookData> = {}

    await createHook("apis/logo.svg", map)
    expect(map).toEqual({})
})
