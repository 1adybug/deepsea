import { watch } from "chokidar"

import { resolveSdrrOptions, resolveSdrrPath, type SdrrOptions } from "./resolveSdrrOptions"
import { syncRouter } from "./syncRouter"

export interface WatchSdrrOptions extends SdrrOptions {
    syncOnStart?: boolean
}

export interface WatchSdrrHooks {
    onError?: (error: unknown) => void
}

export function watchSdrr(options: WatchSdrrOptions = {}, hooks: WatchSdrrHooks = {}) {
    const { syncOnStart = true, ...sdrrOptions } = options
    const resolved = resolveSdrrOptions(sdrrOptions)

    let running = false
    let pending = false

    const onError =
        hooks.onError ??
        ((error: unknown) => {
            console.error("[sdrr]", error)
        })

    async function run() {
        if (running) {
            pending = true
            return
        }

        running = true

        try {
            do {
                pending = false
                await syncRouter(resolved)
            } while (pending)
        } catch (error) {
            onError(error)
        } finally {
            running = false
        }
    }

    const watcher = watch(resolveSdrrPath(resolved, resolved.appDir), {
        awaitWriteFinish: true,
        ignoreInitial: true,
        persistent: true,
    })

    if (syncOnStart) watcher.on("ready", () => void run())

    watcher.on("all", () => void run())

    return watcher
}
