import { readdir, readFile, stat, writeFile } from "fs/promises"
import { join, parse } from "path"

export async function createRouter() {
    const importStatements: string[] = []

    const lazyDeclarations: string[] = []

    let useLazyImport = false

    type Segment =
        | { kind: "root" }
        | { kind: "group"; name: string }
        | { kind: "static"; name: string }
        | { kind: "dynamic"; name: string }
        | { kind: "catchAll"; name: string }
        | { kind: "optionalCatchAll"; name: string }
        | { kind: "parallel"; name: string }
        | { kind: "intercepting"; name: string }

    function parseSegmentName(name: string): Segment {
        if (/^@.+/.test(name)) return { kind: "parallel", name }

        if (/^\(\.\.\.\).+/.test(name) || /^\(\.\.\).+/.test(name) || /^\(\.\).+/.test(name)) return { kind: "intercepting", name }

        const group = name.match(/^\((.+?)\)$/)
        if (group) return { kind: "group", name: group[1]! }

        const optionalCatchAll = name.match(/^\[\[\.\.\.(.+?)\]\]$/)
        if (optionalCatchAll) return { kind: "optionalCatchAll", name: optionalCatchAll[1]! }

        const catchAll = name.match(/^\[\.\.\.(.+?)\]$/)
        if (catchAll) return { kind: "catchAll", name: catchAll[1]! }

        const dynamic = name.match(/^\[(.+?)\]$/)
        if (dynamic) return { kind: "dynamic", name: dynamic[1]! }

        return { kind: "static", name }
    }

    function normalizeIdentifierPart(input: string) {
        const cleaned = input
            .replace(/[()[\]:]/g, "")
            .replace(/\.+/g, "-")
            .replace(/[^a-zA-Z0-9_-]/g, "")
            .replace(/-([a-zA-Z0-9])/g, (_m, a) => String(a).toUpperCase())
            .replace(/_+([a-zA-Z0-9])/g, (_m, a) => String(a).toUpperCase())

        const withoutLeading = cleaned.replace(/^(\d)/, "_$1")
        return withoutLeading || "X"
    }

    function getSegmentImportPrefix(dirs: string[]) {
        if (dirs.length === 1) return "Root"

        const last = dirs.at(-1)!
        const segment = parseSegmentName(last)

        if (segment.kind === "group") return normalizeIdentifierPart(segment.name)
        if (segment.kind === "dynamic") return normalizeIdentifierPart(segment.name)
        if (segment.kind === "catchAll") return `${normalizeIdentifierPart(segment.name)}Splat`
        if (segment.kind === "optionalCatchAll") return `${normalizeIdentifierPart(segment.name)}OptionalSplat`

        return normalizeIdentifierPart(last)
    }

    function isLayout(name: string) {
        return /^layout(\.lazy)?\.[tj]sx?$/.test(name)
    }

    function isPage(name: string) {
        return /^page(\.lazy)?\.[tj]sx?$/.test(name)
    }

    function isErrorBoundary(name: string) {
        return /^error(\.lazy)?\.[tj]sx?$/.test(name)
    }

    function isNotFound(name: string) {
        return /^not-found(\.lazy)?\.[tj]sx?$/.test(name)
    }

    function isLazyComponent(name: string) {
        return /\.lazy\.[tj]sx?$/.test(name)
    }

    const routeFileExtPriority = ["tsx", "jsx", "ts", "js"] as const

    function getRouteFileExtScore(filename: string) {
        const ext = parse(filename).ext.replace(/^\./, "").toLowerCase()
        const index = routeFileExtPriority.indexOf(ext as (typeof routeFileExtPriority)[number])
        return index === -1 ? 0 : routeFileExtPriority.length - index
    }

    function compareRouteFiles(a: string, b: string) {
        const aLazy = isLazyComponent(a)
        const bLazy = isLazyComponent(b)
        if (aLazy !== bLazy) return aLazy ? -1 : 1

        const aScore = getRouteFileExtScore(a)
        const bScore = getRouteFileExtScore(b)
        if (aScore !== bScore) return bScore - aScore

        return a.localeCompare(b)
    }

    async function pickPreferredRouteFile(dirs: string[], candidates: string[]) {
        const meaningful: string[] = []

        for (const item of candidates) {
            if (await hasMeaningfulContent(join(...dirs, item))) meaningful.push(item)
        }

        return meaningful.sort(compareRouteFiles).at(0)
    }

    const nameCount: Record<string, number> = {}

    function getExportName(name: string) {
        if (nameCount[name] === undefined) {
            nameCount[name] = 1
            return name
        }

        nameCount[name]++
        return `${name}${nameCount[name]}`
    }

    async function hasMeaningfulContent(path: string) {
        try {
            const stats = await stat(path)
            if (!stats.isFile()) return false
            const content = await readFile(path, "utf-8")
            return content.trim().length > 0
        } catch {
            return false
        }
    }

    interface GetRouteParams {
        dirs: string[]
        item: string
        hasActionFile: boolean
        hasLoaderFile: boolean
        hasShouldRevalidateFile: boolean
    }

    async function getRoute({ dirs, item, hasActionFile, hasLoaderFile, hasShouldRevalidateFile }: GetRouteParams): Promise<Router> {
        const prefix = getSegmentImportPrefix(dirs)
        const { name: parsedName } = parse(item)
        const name = normalizeIdentifierPart(parsedName.replace(/\.lazy$/, ""))

        function getRouteExportName(name: string, upperCase = false) {
            const prefixCased = upperCase ? prefix.replace(/^./, m => m.toUpperCase()) : prefix.replace(/^./, m => m.toLowerCase())
            const nameCased = name.replace(/^./, m => m.toUpperCase())
            return getExportName(`${prefixCased}${nameCased}`)
        }

        const Component = getRouteExportName(name, true)
        const action = hasActionFile ? getRouteExportName("action") : undefined
        const loader = hasLoaderFile ? getRouteExportName("loader") : undefined
        const shouldRevalidate = hasShouldRevalidateFile ? getRouteExportName("shouldRevalidate") : undefined

        const baseImportPath = `@/${dirs.map(item => `${item}/`).join("")}`
        const componentModulePath = `${baseImportPath}${item}`

        if (isLazyComponent(item)) {
            useLazyImport = true
            lazyDeclarations.push(`const ${Component} = lazy(() => import("${componentModulePath}"))`)
        } else importStatements.push(`import ${Component} from "${componentModulePath}"`)

        if (action) importStatements.push(`import { action as ${action} } from "${baseImportPath}action.ts"`)
        if (loader) importStatements.push(`import { loader as ${loader} } from "${baseImportPath}loader.ts"`)
        if (shouldRevalidate) importStatements.push(`import { shouldRevalidate as ${shouldRevalidate} } from "${baseImportPath}shouldRevalidate.ts"`)

        function getHashName(name: string) {
            return `$$${name}$$`
        }

        return {
            Component: getHashName(Component),
            action: action ? getHashName(action) : undefined,
            loader: loader ? getHashName(loader) : undefined,
            shouldRevalidate: shouldRevalidate ? getHashName(shouldRevalidate) : undefined,
        }
    }

    function getRoutePath(dirs: string[]) {
        if (dirs.length === 1) return "/"

        const last = dirs.at(-1)!
        const segment = parseSegmentName(last)

        if (segment.kind === "group") return undefined
        if (segment.kind === "dynamic") return `:${segment.name}`

        if (segment.kind === "static") return segment.name

        if (segment.kind === "parallel") throw new Error(`不支持 Next.js 的并行路由目录：${last}（@slot）。react-router 没有命名 slot/outlet 的等价能力。`)

        if (segment.kind === "intercepting") throw new Error(`不支持 Next.js 的拦截路由目录：${last}（(.)/(..)/(...)）。`)

        if (segment.kind === "catchAll" || segment.kind === "optionalCatchAll") throw new Error("catch-all 段的 path 由专用逻辑生成，不应调用 getRoutePath()")

        return last
    }

    interface Router {
        path?: string
        index?: boolean
        loader?: string
        action?: string
        shouldRevalidate?: string
        Component?: string
        ErrorBoundary?: string
        children?: Router[]
    }

    async function createRouter(...dirs: string[]): Promise<Router | undefined> {
        const currentDir = join(...dirs)
        const content = await readdir(currentDir)

        const last = dirs.at(-1)!
        const segment = dirs.length === 1 ? ({ kind: "root" } as const) : parseSegmentName(last)

        const dirNames: string[] = []

        const fileNames: string[] = []

        for (const item of content) {
            const stats = await stat(join(currentDir, item))

            if (stats.isDirectory()) dirNames.push(item)
            else fileNames.push(item)
        }

        dirNames.sort((a, b) => {
            const sa = parseSegmentName(a)
            const sb = parseSegmentName(b)

            const order: Record<Segment["kind"], number> = {
                root: 0,
                group: 1,
                static: 2,
                dynamic: 3,
                catchAll: 4,
                optionalCatchAll: 5,
                parallel: 6,
                intercepting: 7,
            }

            const diff = order[sa.kind] - order[sb.kind]
            if (diff !== 0) return diff
            return a.localeCompare(b)
        })

        const layoutItem = await pickPreferredRouteFile(dirs, fileNames.filter(isLayout))
        const pageItem = await pickPreferredRouteFile(dirs, fileNames.filter(isPage))
        const errorItem = await pickPreferredRouteFile(dirs, fileNames.filter(isErrorBoundary))
        const notFoundItem = await pickPreferredRouteFile(dirs, fileNames.filter(isNotFound))

        const hasPage = !!pageItem
        const hasActionFile = hasPage && (await hasMeaningfulContent(join(...dirs, "action.ts")))
        const hasLoaderFile = hasPage && (await hasMeaningfulContent(join(...dirs, "loader.ts")))
        const hasShouldRevalidateFile = hasPage && (await hasMeaningfulContent(join(...dirs, "shouldRevalidate.ts")))

        const layout = layoutItem
            ? await getRoute({
                  dirs,
                  item: layoutItem,
                  hasActionFile: false,
                  hasLoaderFile: false,
                  hasShouldRevalidateFile: false,
              })
            : undefined

        const page = pageItem
            ? await getRoute({
                  dirs,
                  item: pageItem,
                  hasActionFile,
                  hasLoaderFile,
                  hasShouldRevalidateFile,
              })
            : undefined

        const errorBoundary = errorItem
            ? await getRoute({
                  dirs,
                  item: errorItem,
                  hasActionFile: false,
                  hasLoaderFile: false,
                  hasShouldRevalidateFile: false,
              })
            : undefined

        const notFound = notFoundItem
            ? await getRoute({
                  dirs,
                  item: notFoundItem,
                  hasActionFile: false,
                  hasLoaderFile: false,
                  hasShouldRevalidateFile: false,
              })
            : undefined

        const children: Router[] = []

        for (const item of dirNames) {
            const child = await createRouter(...dirs, item)
            if (child) children.push(child)
        }

        function assertNoChildrenForSplat() {
            if (children.length > 0) throw new Error(`Next.js 的 catch-all/optional catch-all 段不允许再有子路由目录：${currentDir}`)
        }

        if (segment.kind === "parallel") throw new Error(`不支持 Next.js 的并行路由目录：${last}（@slot）。react-router 没有命名 slot/outlet 的等价能力。`)

        if (segment.kind === "intercepting") throw new Error(`不支持 Next.js 的拦截路由目录：${last}（(.)/(..)/(...)）。`)

        if (segment.kind === "catchAll") {
            assertNoChildrenForSplat()
            if (!page) throw new Error(`catch-all 目录必须存在 page 文件：${currentDir}`)

            const node: Router = {
                path: `:${segment.name}`,
                Component: layout?.Component,
                ErrorBoundary: errorBoundary?.Component,
                children: [
                    {
                        path: "*",
                        ...page,
                    },
                ],
            }

            return node
        }

        if (segment.kind === "optionalCatchAll") {
            assertNoChildrenForSplat()
            if (!page) throw new Error(`optional catch-all 目录必须存在 page 文件：${currentDir}`)

            const node: Router = {
                Component: layout?.Component,
                ErrorBoundary: errorBoundary?.Component,
                children: [
                    {
                        index: true,
                        ...page,
                    },
                    {
                        path: `:${segment.name}`,
                        children: [
                            {
                                path: "*",
                                ...page,
                            },
                        ],
                    },
                ],
            }

            return node
        }

        const path = getRoutePath(dirs)

        const node: Router = {
            path,
            Component: layout?.Component,
            ErrorBoundary: errorBoundary?.Component,
        }

        const nodeChildren: Router[] = []

        if (page) nodeChildren.push({ index: true, ...page })
        nodeChildren.push(...children)
        if (notFound) nodeChildren.push({ path: "*", Component: notFound.Component })

        node.children = nodeChildren.length > 0 ? nodeChildren : undefined

        if (!node.Component && !node.ErrorBoundary && !node.children) return undefined

        return node
    }

    const router = await createRouter("app")
    if (!router) throw new Error("未在 app 目录中找到任何可生成的路由文件。")

    const str = JSON.stringify(router, null, 4)
        .replace(/^/gm, "    ")
        .replace(/^( *)"(.+?)":/gm, "$1$2:")
        .replace(/"\$\$(.+?)\$\$"/gm, "$1")

    const routeModulesCode = [importStatements.join("\n"), lazyDeclarations.join("\n")].filter(Boolean).join("\n\n")

    const component = `import { FC${useLazyImport ? ", lazy" : ""} } from "react"
import { RouterProvider, createBrowserRouter } from "react-router"

${routeModulesCode}

const router = createBrowserRouter([
${str}
])

const Router: FC = () => <RouterProvider router={router} />

export default Router
`

    await writeFile("components/Router.tsx", component)
}
