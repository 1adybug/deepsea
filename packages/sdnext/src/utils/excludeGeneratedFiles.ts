import { writeVsCodeSetting } from "./writeVsCodeSetting"

export function excludeGeneratedFiles() {
    return writeVsCodeSetting({
        "files.exclude": {
            "actions/**": true,
            "app/api/actions/**": true,
        },
    })
}
