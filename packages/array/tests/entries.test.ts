import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"

import { expect, it } from "vitest"

const directory = process.cwd()
const require = createRequire(resolve(directory, "package.json"))

function run(code: string) {
    const result = spawnSync(process.execPath, ["--input-type=module", "-e", `import assert from 'node:assert/strict';\n${code}`], {
        cwd: directory,
        encoding: "utf8",
        timeout: 30_000,
    })

    expect(result.error).toBeUndefined()
    expect(result.status, result.stdout + result.stderr).toBe(0)
}

it("keeps both root and pure ESM/CJS imports free of Array prototype and constructor changes", () => {
    run(`
        import { createRequire } from 'node:module';
        const require = createRequire(import.meta.url);
        const prototype = Object.getOwnPropertyDescriptors(Array.prototype);
        const constructor = Object.getOwnPropertyDescriptors(Array);
        const root = await import('@1adybug/array');
        const pure = await import('@1adybug/array/pure');
        const map = (await import('@1adybug/array/pure/actual/array/map.js')).default;
        const virtual = (await import('@1adybug/array/pure/full/array/virtual/chunk')).default;
        assert.deepEqual(map([1, 2], x => x * 2), [2, 4]);
        assert.deepEqual(virtual.call([1, 2, 3], 2), [[1, 2], [3]]);
        assert.deepEqual(pure.default.with([1], 0, 2), [2]);
        assert.equal(root.chunk, pure.chunk);
        assert.deepEqual(require('@1adybug/array/pure/chunk').default([1, 2], 1), [[1], [2]]);
        require('@1adybug/array');
        assert.deepEqual(Object.getOwnPropertyDescriptors(Array.prototype), prototype);
        assert.deepEqual(Object.getOwnPropertyDescriptors(Array), constructor);
    `)
})

it("synchronously installs missing standards through core-js-pure implementations", () => {
    run(`
        const methods = ['at', 'findLast', 'findLastIndex', 'toReversed', 'toSorted', 'toSpliced', 'with'];
        for (const name of methods) delete Array.prototype[name];
        delete Array.fromAsync;
        const { extendArrayPrototype } = await import('@1adybug/array');
        for (const name of methods) assert.equal(Array.prototype[name], undefined);
        assert.equal(Array.fromAsync, undefined);
        assert.equal(extendArrayPrototype(), undefined);
        assert.equal([1, 2].at(-1), 2);
        assert.equal([1, 2].findLast(x => x < 2), 1);
        assert.equal([1, 2].findLastIndex(x => x < 2), 0);
        assert.deepEqual([1, 2].toReversed(), [2, 1]);
        assert.deepEqual([2, 1].toSorted(), [1, 2]);
        assert.deepEqual([1, 2].toSpliced(0, 1), [2]);
        assert.deepEqual([1, 2].with(-1, 3), [1, 3]);
        assert.deepEqual(await Array.fromAsync([Promise.resolve(2)]), [2]);
        for (const name of methods) assert.equal(Object.getOwnPropertyDescriptor(Array.prototype, name).enumerable, false);
        assert.deepEqual([1, 2, 3].chunk(2), [[1, 2], [3]]);
    `)
})

it("global per-method imports install only the selected custom method and support .js aliases", () => {
    run(`
        await import('@1adybug/array/actual/array/chunk.js');
        assert.deepEqual([1, 2, 3].chunk(2), [[1, 2], [3]]);
        assert.equal(Array.prototype.toExchange, undefined);
        assert.equal(Array.prototype.nonNullable, undefined);
        const functional = (await import('@1adybug/array/to-exchange')).default;
        assert.deepEqual([1, 2].toExchange(0, 1), [2, 1]);
        assert.deepEqual(functional([1, 2], 0, 1), [2, 1]);
        assert.equal(Object.getOwnPropertyDescriptor(Array.prototype, 'chunk').enumerable, false);
        const virtual = (await import('@1adybug/array/actual/array/virtual/to-unshifted.js')).default;
        assert.deepEqual(virtual.call([2, 3], 1), [1, 2, 3]);
        assert.equal(typeof Array.prototype.toUnshifted, 'function');
    `)
})

it("global profiles distinguish standards from proposals and preserve the auto entry", () => {
    run(`
        await import('@1adybug/array/es/array');
        assert.equal(typeof Array.prototype.chunk, 'function');
        assert.equal(Array.prototype.uniqueBy, undefined);
        assert.equal(Array.prototype.group, undefined);
        await import('@1adybug/array/actual');
        assert.equal(typeof Array.prototype.group, 'function');
        assert.equal(Array.prototype.uniqueBy, undefined);
        await import('@1adybug/array/auto');
        assert.deepEqual([1, 1].uniqueBy(), [1]);
        assert.equal([1, 2].lastIndex, 1);
        assert.equal([1, 2].lastItem, 2);
    `)
})

it("exports every upstream Array operation in each matching profile", () => {
    const coreRoot = dirname(require.resolve("core-js/package.json"))
    const manifest = JSON.parse(readFileSync(resolve(directory, "package.json"), "utf8"))

    for (const profile of ["es", "stable", "actual", "full"]) {
        for (const file of readdirSync(resolve(coreRoot, profile, "array"))) {
            if (!file.endsWith(".js") || file === "index.js") continue
            const method = file.slice(0, -3).replace(/-([a-z])/g, (_, value: string) => value.toUpperCase())
            expect(manifest.arrayMethods[profile]).toContain(method)
            expect(require.resolve(`@1adybug/array/pure/${profile}/array/${file}`)).toContain("dist")
            expect(typeof require(`@1adybug/array/pure/${profile}/${file}`).default).toBe("function")
        }
    }
})

it("generates entry points without rewriting unchanged files", () => {
    const paths = ["package.json", "src/generated/pure/full/index.ts", "src/generated/global/full/chunk.ts"]

    const times = paths.map(path => statSync(resolve(directory, path)).mtimeMs)
    const stale = resolve(directory, "src/generated/obsolete.ts")
    writeFileSync(stale, "// Generated by scripts/generate.mjs.\nexport {}\n")
    const result = spawnSync(process.execPath, ["scripts/generate.mjs"], { cwd: directory, encoding: "utf8", timeout: 30_000 })
    expect(result.status, result.stdout + result.stderr).toBe(0)
    expect(paths.map(path => statSync(resolve(directory, path)).mtimeMs)).toEqual(times)
    expect(existsSync(stale)).toBe(false)
}, 30_000)
