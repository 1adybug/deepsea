import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"

import { afterEach, describe, expect, it } from "bun:test"

import { createRouter } from "../src/utils/createRouter"

const testRoots: string[] = []

afterEach(async () => {
    await Promise.all(testRoots.splice(0).map(root => rm(root, { force: true, recursive: true })))
})

async function createRouteFile(root: string, path: string) {
    const filePath = join(root, "app", ...path.split("/"))
    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, "export default function Page() { return null }\n")
}

describe("createRouter", () => {
    it("不会让仅包含详情子路由的静态目录遮蔽动态列表路由", async () => {
        const root = await mkdtemp(join(tmpdir(), "sdrr-create-router-"))
        testRoots.push(root)

        await mkdir(join(root, "components"), { recursive: true })
        await createRouteFile(root, "layout.tsx")
        await createRouteFile(root, "erp/contracts/[id]/page.tsx")
        await createRouteFile(root, "erp/[module]/page.tsx")

        await createRouter({ root })

        const router = await readFile(join(root, "components/Router.tsx"), "utf8")

        expect(router).toContain('path: "erp/contracts/:id"')
        expect(router).toContain('path: "erp/:module"')
        expect(router).not.toContain('path: "contracts",')
    })
})
