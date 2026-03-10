import { join } from "path"

import { resolveProjectImportPath } from "./resolveProjectImportPath"
import { getSharedModuleInfo, isScriptModule, writeGeneratedFile } from "./sharedArtifact"

export async function createAction(path: string) {
    const info = getSharedModuleInfo(path)

    if (!isScriptModule(info.relativePath)) return

    const actionPath = join("actions", info.relativePath)
    const createResponseFnImportPath = await resolveProjectImportPath(actionPath, "server/createResponseFn")
    const sharedImportPath = await resolveProjectImportPath(actionPath, `shared/${info.importPath}`)

    await writeGeneratedFile({
        path: actionPath,
        content: `"use server"

import { createResponseFn } from "${createResponseFnImportPath}"

import { ${info.name} } from "${sharedImportPath}"

export const ${info.name}Action = createResponseFn(${info.name})
`
    })
}
