import type { RsbuildPlugin } from "@rsbuild/core"
import type { FSWatcher } from "chokidar"

import { resolveSdrrOptions, type SdrrOptions } from "./utils/resolveSdrrOptions"
import { syncRouter } from "./utils/syncRouter"
import { watchSdrr } from "./utils/watchSdrr"

export interface SdrrRsbuildPluginOptions extends SdrrOptions {}

export function sdrrRsbuildPlugin(options: SdrrRsbuildPluginOptions = {}): RsbuildPlugin {
    const resolved = resolveSdrrOptions(options)

    let watcher: FSWatcher | undefined

    async function closeWatcher() {
        if (!watcher) return
        await watcher.close()
        watcher = undefined
    }

    function logError(error: unknown) {
        console.error("[sdrr]", error)
    }

    return {
        name: "sdrr:rsbuild",
        setup(api) {
            api.onBeforeBuild(async () => {
                await syncRouter(resolved)
            })

            api.onBeforeStartDevServer(async () => {
                await syncRouter(resolved)
                await closeWatcher()
                watcher = watchSdrr(
                    {
                        ...resolved,
                        syncOnStart: false,
                    },
                    {
                        onError: logError,
                    },
                )

                return async () => {
                    await closeWatcher()
                }
            })

            api.onCloseDevServer(closeWatcher)
            api.onExit(closeWatcher)
        },
    }
}
