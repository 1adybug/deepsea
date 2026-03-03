import { join } from "path"

import { getSharedModuleInfo, isScriptModule, writeGeneratedFile } from "./sharedArtifact"

export async function createAction(path: string) {
    const info = getSharedModuleInfo(path)

    if (!isScriptModule(info.relativePath)) return

    await writeGeneratedFile({
        path: join("actions", info.relativePath),
        content: `"use server"

import { createResponseFn } from "@/server/createResponseFn"

import { ${info.name} } from "@/shared/${info.importPath}"

export const ${info.name}Action = createResponseFn(${info.name})
`
    })
}
