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
