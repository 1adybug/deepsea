import { readFile } from "fs/promises"
import { RsbuildPlugins } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"

export async function getRslibConfig() {
    const text = await readFile("./package.json", "utf-8")
    const packageJson = JSON.parse(text)
    const isReact = (packageJson.dependencies?.react ?? packageJson.devDependencies?.react ?? packageJson.peerDependencies?.react) !== undefined

    const plugins: RsbuildPlugins = []

    if (isReact) {
        plugins.push(pluginReact())
    }

    return defineConfig({
        source: {
            entry: {
                index: ["./src/**"],
            },
        },
        lib: [
            {
                bundle: false,
                dts: true,
                format: "esm",
                syntax: ["chrome >= 87"],
            },
            {
                bundle: false,
                dts: true,
                format: "cjs",
                syntax: ["chrome >= 87"],
            },
        ],
        output: {
            target: "web",
        },
        plugins,
    })
}
