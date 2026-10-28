import { readFile } from "node:fs/promises"

import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"

/** @param {{ target?: "web" | "node", formats?: ("esm" | "cjs")[] }} [options] */
export function getRslibConfig({ target = "web", formats = target === "node" ? ["esm"] : ["esm", "cjs"] } = {}) {
    return async () => {
        const packageJson = JSON.parse(await readFile("./package.json", "utf8"))
        const isReact = [packageJson.dependencies, packageJson.devDependencies, packageJson.peerDependencies].some(deps => deps?.react !== undefined)

        return defineConfig({
            source: {
                entry: {
                    index: ["./src/**"],
                },
            },
            lib: formats.map((format, index) => ({
                bundle: false,
                dts: index === 0 ? { abortOnError: true } : false,
                format,
                syntax: target === "node" ? ["node >= 22"] : ["chrome >= 87"],
            })),
            output: { target },
            plugins: isReact ? [pluginReact()] : [],
        })
    }
}
