import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"

import { afterEach, describe, expect, it } from "vitest"

import { createRouter } from "../src/utils/createRouter"
import { resolveProjectImportPath } from "../src/utils/resolveProjectImportPath"
import { resolveSdrrOptions } from "../src/utils/resolveSdrrOptions"
import { syncRouter } from "../src/utils/syncRouter"

const roots: string[] = []

afterEach(async () => {
    await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function fixture(files: Record<string, string>) {
    const root = await mkdtemp(join(tmpdir(), "deepsea-routes-"))
    roots.push(root)
    await mkdir(join(root, "components"))

    for (const [path, text] of Object.entries(files)) {
        const output = join(root, path)
        await mkdir(dirname(output), { recursive: true })
        await writeFile(output, text)
    }

    return root
}

const page = "export default function Page() { return null }"

describe("route generation contracts", () => {
    it("supports groups, params, catch-all segments, lazy pages and data modules", async () => {
        const root = await fixture({
            "app/layout.tsx": page,
            "app/(public)/page.tsx": page,
            "app/users/[id]/page.lazy.tsx": page,
            "app/users/[id]/loader.ts": "export const loader = async () => ({ id: 1 })",
            "app/users/[id]/action.ts": "export const action = async () => null",
            "app/files/[...path]/page.tsx": page,
            "app/docs/[[...slug]]/page.tsx": page,
            "app/not-found.tsx": page,
        })
        expect(await createRouter({ root })).toBe(true)
        const output = await readFile(join(root, "components/Router.tsx"), "utf8")
        expect(output).toContain('path: "users/:id"')
        expect(output).toContain('path: "files/:path"')
        expect(output).toContain('path: "docs/:slug"')
        expect(output).toContain('path: "docs"')
        expect(output).toContain('path: "*"')
        expect(output).toContain("lazy(")
        expect(output).toContain("loader:")
        expect(output).toContain("action:")
        expect(output).not.toContain('path: "(public)"')
        const before = await stat(join(root, "components/Router.tsx"), { bigint: true })
        expect(await createRouter({ root })).toBe(false)
        expect((await stat(join(root, "components/Router.tsx"), { bigint: true })).mtimeNs).toBe(before.mtimeNs)
    })

    it("creates custom output directories, updates generated files and merges editor settings", async () => {
        const root = await fixture({
            "routes/page.tsx": page,
            ".vscode/settings.json": JSON.stringify({ "editor.tabSize": 2, "files.exclude": { keep: true } }),
        })

        const options = {
            root,
            appDir: "routes",
            routerOutputPath: "generated/nested/Router.tsx",
            routerExportType: "default" as const,
            updateVsCodeSettings: true,
        }

        await syncRouter(options)
        expect(await readFile(join(root, options.routerOutputPath), "utf8")).toContain("export default Router")

        expect(JSON.parse(await readFile(join(root, ".vscode/settings.json"), "utf8"))).toEqual({
            "editor.tabSize": 2,
            "files.exclude": { keep: true, [options.routerOutputPath]: true },
        })

        await mkdir(join(root, "routes/new"))
        await writeFile(join(root, "routes/new/page.tsx"), page)
        expect(await syncRouter(options)).toBe(true)
        expect(await readFile(join(root, options.routerOutputPath), "utf8")).toContain('path: "new"')
    })

    it("ignores empty modules and uses the preferred file extension", async () => {
        const root = await fixture({ "app/page.tsx": "  ", "app/page.jsx": page })
        await createRouter({ root })
        const output = await readFile(join(root, "components/Router.tsx"), "utf8")
        expect(output).toContain("../app/page.jsx")
        expect(output).not.toContain("../app/page.tsx")
    })
})

describe("configuration", () => {
    it("normalizes options and rejects empty paths and unknown export modes", () => {
        const options = resolveSdrrOptions({ appDir: "./app/", routerOutputPath: "./components/Router.tsx" })
        expect(options.appDir).toBe("app")
        expect(options.routerOutputPath).toBe("components/Router.tsx")
        expect(options.routerExportType).toBe("named")
        expect(() => resolveSdrrOptions({ appDir: "." })).toThrow()
        expect(() => resolveSdrrOptions({ routerExportType: "other" as never })).toThrow()
    })

    it("resolves relative imports and inherited JSONC aliases independently per project", async () => {
        const root = await fixture({ "base.json": '{"compilerOptions":{"paths":{"@/*":["./*"]}}}', "tsconfig.json": '{/* comment */"extends":"./base.json",}' })
        expect(await resolveProjectImportPath("components/Router.tsx", "app/page.tsx", root)).toBe("@/app/page.tsx")
        const other = await fixture({})
        expect(await resolveProjectImportPath("components/Router.tsx", "app/page.tsx", other)).toBe("../app/page.tsx")
    })
})
