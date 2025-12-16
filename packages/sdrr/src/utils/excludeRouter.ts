import { writeVsCodeSetting } from "./writeVsCodeSetting"

export function excludeRouter() {
    return writeVsCodeSetting({
        "files.exclude": {
            "components/Router.tsx": true,
        },
    })
}
