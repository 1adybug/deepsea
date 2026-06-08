/* eslint-disable no-restricted-syntax */

import type { FSWatcher } from "chokidar"
import type { EnvironmentModuleNode, Plugin, ViteDevServer } from "vite"

import { type SdrrOptions, resolveSdrrOptions, resolveSdrrPath } from "./utils/resolveSdrrOptions"
import { syncRouter } from "./utils/syncRouter"
import { watchSdrr } from "./utils/watchSdrr"

export interface SdrrVitePluginOptions extends SdrrOptions {}

export function sdrrVitePlugin(options: SdrrVitePluginOptions = {}): Plugin {
    const resolved = resolveSdrrOptions(options)
    const appDirAbsPath = resolveSdrrPath(resolved, resolved.appDir)
    const routerOutputAbsPath = resolveSdrrPath(resolved, resolved.routerOutputPath)

    let watcher: FSWatcher | undefined
    let server: ViteDevServer | undefined

    async function closeWatcher() {
        if (!watcher) return
        await watcher.close()
        watcher = undefined
    }

    function waitForWatcherReady(current: FSWatcher) {
        return new Promise<void>(resolve => {
            current.once("ready", () => resolve())
        })
    }

    function logError(error: unknown) {
        const message = error instanceof Error ? (error.stack ?? error.message) : String(error)

        if (server) {
            server.config.logger.error(`[sdrr] ${message}`)
            return
        }

        console.error("[sdrr]", error)
    }

    function invalidateRouterModules(viteServer: ViteDevServer, timestamp: number) {
        for (const environment of Object.values(viteServer.environments)) {
            const modules = environment.moduleGraph.getModulesByFile(routerOutputAbsPath)
            if (!modules) continue

            const seen = new Set<EnvironmentModuleNode>()

            for (const module of modules) environment.moduleGraph.invalidateModule(module, seen, timestamp, true)
        }
    }

    function reloadRouter(viteServer: ViteDevServer) {
        invalidateRouterModules(viteServer, Date.now())

        viteServer.hot.send({
            type: "full-reload",
            path: "*",
            triggeredBy: appDirAbsPath,
        })
    }

    function registerClose(viteServer: ViteDevServer) {
        viteServer.httpServer?.once("close", () => {
            if (server === viteServer) server = undefined
            void closeWatcher()
        })
    }

    return {
        name: "sdrr:vite",
        async buildStart() {
            await syncRouter(resolved)
        },
        async configureServer(viteServer) {
            server = viteServer
            await closeWatcher()
            watcher = watchSdrr(
                {
                    ...resolved,
                    syncOnStart: false,
                },
                {
                    onError: logError,
                    onSync(changed) {
                        if (changed) reloadRouter(viteServer)
                    },
                },
            )
            await waitForWatcherReady(watcher)
            registerClose(viteServer)
        },
        async closeBundle() {
            await closeWatcher()
            server = undefined
        },
    }
}
