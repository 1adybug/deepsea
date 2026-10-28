import assert from "node:assert/strict"
import { test } from "node:test"
import { fileURLToPath } from "node:url"

import ts from "typescript"

test("TypeScript resolves all shared presets with strict checking and bundler resolution", () => {
    for (const name of ["base", "library", "react-library", "app"]) {
        const path = fileURLToPath(new URL(`../${name}.json`, import.meta.url))
        const config = ts.readConfigFile(path, ts.sys.readFile)
        assert.equal(config.error, undefined)
        const parsed = ts.parseJsonConfigFileContent({ ...config.config, files: [] }, ts.sys, fileURLToPath(new URL("../", import.meta.url)))
        assert.equal(parsed.options.strict, true)
        assert.equal(parsed.options.moduleResolution, ts.ModuleResolutionKind.Bundler)
        if (name === "library" || name === "react-library") assert.equal(parsed.options.declaration, true)
        if (name === "react-library" || name === "app") assert.equal(parsed.options.jsx, ts.JsxEmit.ReactJSX)
        if (name === "app") assert.equal(parsed.options.noEmit, true)
    }
})

test("shared presets preserve consumer overrides and enforce strict assignability", () => {
    const base = fileURLToPath(new URL("../base.json", import.meta.url))
    const config = ts.parseJsonConfigFileContent({ extends: base, compilerOptions: { target: "ES2022", noEmit: true }, files: [] }, ts.sys, process.cwd())
    assert.equal(config.options.target, ts.ScriptTarget.ES2022)
    assert.equal(config.options.noEmit, true)
    assert.equal(config.options.strict, true)
    assert.equal(config.options.verbatimModuleSyntax, true)
    const source = "const value: number = null; export { value }"
    const path = fileURLToPath(new URL("./strict-fixture.ts", import.meta.url))
    const host = ts.createCompilerHost(config.options)
    const getSourceFile = host.getSourceFile.bind(host)
    host.getSourceFile = (name, languageVersion, onError, shouldCreateNewSourceFile) =>
        name.replaceAll("\\", "/") === path.replaceAll("\\", "/")
            ? ts.createSourceFile(path, source, languageVersion)
            : getSourceFile(name, languageVersion, onError, shouldCreateNewSourceFile)
    const program = ts.createProgram([path], config.options, host)
    assert.ok(program.getSemanticDiagnostics().some(diagnostic => diagnostic.code === 2322))
})
