import { readFile } from "node:fs/promises"

import type { RsbuildDevServer, RsbuildPlugin } from "@rsbuild/core"
import type { FSWatcher } from "chokidar"

import { type SdrrOptions, resolveSdrrOptions, resolveSdrrPath } from "./utils/resolveSdrrOptions"
import { syncRouter } from "./utils/syncRouter"
import { watchSdrr } from "./utils/watchSdrr"

export interface SdrrRsbuildPluginOptions extends SdrrOptions {}

export function sdrrRsbuildPlugin(options: SdrrRsbuildPluginOptions = {}): RsbuildPlugin {
    const resolved = resolveSdrrOptions(options)
    const appDirAbsPath = resolveSdrrPath(resolved, resolved.appDir)
    const routerOutputAbsPath = resolveSdrrPath(resolved, resolved.routerOutputPath)

    let watcher: FSWatcher | undefined
    let devServer: Pick<RsbuildDevServer, "sockWrite"> | undefined
    let shouldReloadAfterCompile = false

    async function closeWatcher() {
        if (!watcher) return
        await watcher.close()
        watcher = undefined
    }

    function logError(error: unknown) {
        console.error("[sdrr]", error)
    }

    function markRouteChanged(changed: boolean) {
        if (changed) shouldReloadAfterCompile = true
    }

    function registerAppDirDependency(compiler: any) {
        const compilers = Array.isArray(compiler.compilers) ? compiler.compilers : [compiler]

        for (const item of compilers) {
            item.hooks.watchRun.tapPromise("sdrr:rsbuild", async () => {
                markRouteChanged(await syncRouter(resolved))
            })

            item.hooks.thisCompilation.tap("sdrr:rsbuild", (compilation: any) => {
                compilation.contextDependencies.add(appDirAbsPath)
            })
        }
    }

    return {
        name: "sdrr:rsbuild",
        setup(api) {
            api.onBeforeBuild(async () => {
                await syncRouter(resolved)
            })

            api.onAfterCreateCompiler(({ compiler }) => {
                registerAppDirDependency(compiler)
            })

            api.transform(
                {
                    test: (path: string) => path === routerOutputAbsPath,
                    order: "pre",
                },
                async ({ addContextDependency }) => {
                    markRouteChanged(await syncRouter(resolved))
                    addContextDependency(appDirAbsPath)

                    return await readFile(routerOutputAbsPath, "utf-8")
                },
            )

            api.onBeforeDevCompile(async ({ isFirstCompile }) => {
                const changed = await syncRouter(resolved)
                if (!isFirstCompile) markRouteChanged(changed)
            })

            api.onAfterDevCompile(({ isFirstCompile }) => {
                if (isFirstCompile || !shouldReloadAfterCompile) return

                shouldReloadAfterCompile = false
                devServer?.sockWrite("full-reload")
            })

            api.onBeforeStartDevServer(async ({ server }) => {
                devServer = server
                await syncRouter(resolved)
                await closeWatcher()
                watcher = watchSdrr(
                    {
                        ...resolved,
                        syncOnStart: false,
                    },
                    {
                        onError: logError,
                        onSync: markRouteChanged,
                    },
                )

                return async () => {
                    devServer = undefined
                    await closeWatcher()
                }
            })

            api.onCloseDevServer(closeWatcher)
            api.onExit(closeWatcher)
        },
    }
}
