import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

import ts from "typescript"
import { expect } from "vitest"

export async function compileGeneratedFiles(files: Record<string, string>) {
    const artifacts = join(process.cwd(), ".artifacts")
    await mkdir(artifacts, { recursive: true })
    const root = await mkdtemp(join(artifacts, "generated-types-"))

    try {
        for (const [path, source] of Object.entries(files)) {
            const output = join(root, path)
            await mkdir(dirname(output), { recursive: true })
            await writeFile(output, source)
        }

        const program = ts.createProgram(
            Object.keys(files).map(path => join(root, path)),
            {
                strict: true,
                noEmit: true,
                skipLibCheck: true,
                verbatimModuleSyntax: true,
                module: ts.ModuleKind.ESNext,
                moduleResolution: ts.ModuleResolutionKind.Bundler,
                target: ts.ScriptTarget.ESNext,
                types: [],
            },
        )

        const diagnostics = ts.getPreEmitDiagnostics(program)
        expect(diagnostics.map(diagnostic => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"))).toEqual([])
    } finally {
        await rm(root, { recursive: true, force: true })
    }
}
