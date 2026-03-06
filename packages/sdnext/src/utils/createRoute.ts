import { readdir } from "fs/promises"
import { join } from "path"

import { getSharedModuleInfo, isScriptModule, writeGeneratedFile } from "./sharedArtifact"

export async function createRoute(path?: string) {
    if (path) {
        const info = getSharedModuleInfo(path)
        if (!isScriptModule(info.relativePath)) return
    }

    const modules = await getSharedModules("shared")

    await writeGeneratedFile({
        path: join("app", "api", "action", "[...action]", "route.ts"),
        content: getRouteFileContent(modules),
    })
}

export interface SharedRouteModule {
    importPath: string
    name: string
}

async function getSharedModules(dir: string): Promise<SharedRouteModule[]> {
    const entries = await readdir(dir, { withFileTypes: true })

    const modules: SharedRouteModule[] = []

    for (const entry of entries) {
        const itemPath = join(dir, entry.name)

        if (entry.isDirectory()) {
            modules.push(...(await getSharedModules(itemPath)))
            continue
        }

        if (!entry.isFile() || !isScriptModule(entry.name)) continue

        const info = getSharedModuleInfo(itemPath)

        modules.push({
            importPath: info.importPath,
            name: info.name,
        })
    }

    modules.sort((a, b) => a.importPath.localeCompare(b.importPath))

    return modules
}

export interface GetRouteFileContentParamsItem {
    importPath: string
    name: string
}

function getRouteFileContent(items: GetRouteFileContentParamsItem[]) {
    const importLines = items.map(item => `import { ${item.name} } from "@/shared/${item.importPath}"`).join("\n")
    const registerLines = items.map(item => `registerRoute(${item.name})`).join("\n")

    return `import { NextRequest, NextResponse } from "next/server"

import { createRouteFn, OriginalResponseFn, RouteBodyType, RouteHandler } from "@/server/createResponseFn"
${importLines ? `\n${importLines}\n` : ""}
const routeMap = new Map<string, RouteHandler>()

function registerRoute<TParams extends [arg?: unknown], TData, TPathname extends string, TRouteBodyType extends RouteBodyType = "json">(
    fn: OriginalResponseFn<TParams, TData, TPathname, TRouteBodyType>,
) {
    if (!fn.route) return
    const pathname = fn.route.pathname.replace(/(^\\/|\\/$)/g, "")
    if (routeMap.has(pathname)) throw new Error(\`pathname \${pathname} is duplicate\`)
    routeMap.set(pathname, createRouteFn(fn))
}

${registerLines ? `${registerLines}\n\n` : ""}export function POST(request: NextRequest) {
    const { pathname } = new URL(request.url)
    const routeHandler = routeMap.get(pathname.replace(/(^\\/api\\/action\\/|\\/$)/g, ""))

    if (!routeHandler) return NextResponse.json({ success: false, data: undefined, message: "Not Found", code: 404 }, { status: 404 })

    return routeHandler(request)
}
`
}
