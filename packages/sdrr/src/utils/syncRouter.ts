import { createRouter } from "./createRouter"
import { excludeRouter } from "./excludeRouter"
import { resolveSdrrOptions, type SdrrOptions } from "./resolveSdrrOptions"

export async function syncRouter(options: SdrrOptions = {}) {
    const resolved = resolveSdrrOptions(options)

    if (resolved.updateVsCodeSettings) await excludeRouter(resolved)

    return await createRouter(resolved)
}
