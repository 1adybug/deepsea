import { join } from "path"

import { createAction } from "./createAction"
import { createRoute } from "./createRoute"
import { getSharedModuleInfo, isScriptModule, normalizeSharedPath, removeGeneratedFile, toKebabCase } from "./sharedArtifact"

export async function syncSharedArtifacts(path: string) {
    const info = getSharedModuleInfo(path)

    if (!isScriptModule(info.relativePath)) return

    await createAction(path)
    await createRoute(path)
}

export async function removeSharedArtifacts(path: string) {
    const info = getSharedModuleInfo(path)

    if (!isScriptModule(info.relativePath)) return

    await removeGeneratedFile({
        path: join("actions", info.relativePath),
        stopPath: "actions",
    })

    await removeGeneratedFile({
        path: join("app", "api", "actions", info.dir, toKebabCase(info.name)),
        stopPath: join("app", "api", "actions"),
    })
}

export async function removeSharedArtifactDirectory(path: string) {
    const relativePath = normalizeSharedPath(path)

    await removeGeneratedFile({
        path: join("actions", relativePath),
        stopPath: "actions",
    })

    await removeGeneratedFile({
        path: join("app", "api", "actions", relativePath),
        stopPath: join("app", "api", "actions"),
    })
}
