import { writeVsCodeSetting } from "./writeVsCodeSetting"

export function excludeActions() {
    return writeVsCodeSetting({
        "files.exclude": {
            "actions/**": true,
        },
    })
}
