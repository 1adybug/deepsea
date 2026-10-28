import type { ResolvedSdrrOptions } from "./resolveSdrrOptions"
import { writeVsCodeSetting } from "./writeVsCodeSetting"

export function excludeRouter({ root, routerOutputPath }: ResolvedSdrrOptions) {
    return writeVsCodeSetting(root, {
        "files.exclude": {
            [routerOutputPath]: true,
        },
    })
}
