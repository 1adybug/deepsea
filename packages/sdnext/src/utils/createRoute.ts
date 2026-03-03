import { readFile } from "fs/promises"
import { join } from "path"

import { getSharedModuleInfo, isScriptModule, removeGeneratedFile, toKebabCase, writeGeneratedFile } from "./sharedArtifact"

export async function createRoute(path: string) {
    const info = getSharedModuleInfo(path)

    if (!isScriptModule(info.relativePath)) return

    const routeDirPath = join("app", "api", "actions", info.dir, toKebabCase(info.name))
    const routePath = join(routeDirPath, "route.ts")

    const content = await readFile(join("shared", info.relativePath), "utf-8")

    if (!isRouteEnabled({ content, name: info.name })) {
        await removeGeneratedFile({
            path: routeDirPath,
            stopPath: join("app", "api", "actions"),
        })

        return
    }

    await writeGeneratedFile({
        path: routePath,
        content: `import { createRoute } from "@/server/createResponseFn"

import { ${info.name} } from "@/shared/${info.importPath}"

export const { POST } = createRoute(${info.name})
`,
    })
}

export interface IsRouteEnabledParams {
    content: string
    name: string
}

function isRouteEnabled({ content, name }: IsRouteEnabledParams) {
    const routeRegExp = new RegExp(`\\b${name}\\.route\\s*=\\s*(true\\b|\\{)`)
    return routeRegExp.test(content)
}
