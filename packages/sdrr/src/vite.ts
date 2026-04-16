import type { FSWatcher } from "chokidar"

import { resolveSdrrOptions, type SdrrOptions } from "./utils/resolveSdrrOptions"
import { syncRouter } from "./utils/syncRouter"
import { watchSdrr } from "./utils/watchSdrr"

export interface SdrrVitePluginOptions extends SdrrOptions {}

interface ViteDevServerLike {
    config: {
        logger: {
            error(message: string): void
        }
    }
}

export interface SdrrVitePlugin {
    name: string
    buildStart?: () => Promise<void>
    configureServer?: (viteServer: any) => void | Promise<void | (() => void | Promise<void>)> | (() => void | Promise<void>)
    closeBundle?: () => Promise<void>
}

export function sdrrVitePlugin(options: SdrrVitePluginOptions = {}): SdrrVitePlugin {
    const resolved = resolveSdrrOptions(options)

    let watcher: FSWatcher | undefined
    let server: ViteDevServerLike | undefined

    async function closeWatcher() {
        if (!watcher) return
        await watcher.close()
        watcher = undefined
    }

    function logError(error: unknown) {
        const message = error instanceof Error ? error.stack ?? error.message : String(error)
        if (server) {
            server.config.logger.error(`[sdrr] ${message}`)
            return
        }

        console.error("[sdrr]", error)
    }

    return {
        name: "sdrr:vite",
        async buildStart() {
            await syncRouter(resolved)
        },
        configureServer(viteServer) {
            server = viteServer
            void closeWatcher().then(() => {
                watcher = watchSdrr(
                    {
                        ...resolved,
                        syncOnStart: false,
                    },
                    {
                        onError: logError,
                    },
                )
            })

            return async () => {
                await closeWatcher()
            }
        },
        async closeBundle() {
            await closeWatcher()
        },
    }
}
