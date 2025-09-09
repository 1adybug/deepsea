import { readFile } from "fs/promises"
import { RsbuildPlugins } from "@rsbuild/core"
import { pluginBabel } from "@rsbuild/plugin-babel"
import { pluginReact } from "@rsbuild/plugin-react"
import { defineConfig } from "@rslib/core"

export interface GetRslibConfigParams {
    reactCompiler?: boolean
}

export async function getRslibConfig({ reactCompiler = true }: GetRslibConfigParams = {}) {
    const text = await readFile("./package.json", "utf-8")
    const packageJson = JSON.parse(text)
    const isReact = (packageJson.dependencies?.react ?? packageJson.devDependencies?.react ?? packageJson.peerDependencies?.react) !== undefined

    const plugins: RsbuildPlugins = []

    if (isReact) {
        plugins.push(pluginReact())
        if (reactCompiler) {
            plugins.push(
                pluginBabel({
                    babelLoaderOptions(config) {
                        config.plugins ??= []
                        config.plugins.unshift("babel-plugin-react-compiler")
                    },
                }),
            )
        }
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
