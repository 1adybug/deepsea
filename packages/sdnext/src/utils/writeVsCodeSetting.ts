import { mkdir, readFile, writeFile } from "fs/promises"

import { merge } from "deepsea-tools"

export async function writeVsCodeSetting(config: Record<string, any>) {
    await mkdir(".vscode", { recursive: true })

    let data: Record<string, any>

    try {
        const json = await readFile(".vscode/settings.json", "utf-8")
        data = JSON.parse(json)
    } catch (error) {
        data = {}
    }

    data = merge(data, config)

    await writeFile(".vscode/settings.json", JSON.stringify(data, null, 4))

    return data
}
