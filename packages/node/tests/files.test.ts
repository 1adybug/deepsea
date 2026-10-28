import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { expect, it } from "vitest"

import { copy } from "../src/utils/copy"

it("recursively copies directory trees and supports multiple input files", async () => {
    const root = await mkdtemp(join(tmpdir(), "soda-copy-"))

    try {
        const source = join(root, "source")
        const output = join(root, "output")
        await mkdir(join(source, "nested"), { recursive: true })
        await writeFile(join(source, "nested/data.txt"), "测试\n")
        await copy({ input: source, output })
        expect(await readFile(join(output, "source/nested/data.txt"), "utf8")).toBe("测试\n")
        expect(await readFile(join(source, "nested/data.txt"), "utf8")).toBe("测试\n")
        await copy({ input: [join(source, "nested/data.txt")], output })
        expect(await readFile(join(output, "data.txt"), "utf8")).toBe("测试\n")
        await expect(copy({ input: join(root, "missing"), output })).rejects.toThrow()
    } finally {
        await rm(root, { recursive: true, force: true })
    }
})
