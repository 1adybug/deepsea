import { mkdir, readFile, writeFile } from "fs/promises"

import { merge } from "deepsea-tools"

export interface VsCodeSetting {
    [key: string]: unknown
}

export async function writeVsCodeSetting(config: VsCodeSetting) {
    await mkdir(".vscode", { recursive: true })

    let data: VsCodeSetting

    try {
        const json = await readFile(".vscode/settings.json", "utf-8")
        data = JSON.parse(json) as VsCodeSetting
    } catch (error) {
        if (!isNodeError(error) || error.code !== "ENOENT") {
            throw new Error("Failed to read .vscode/settings.json. Please ensure it is a valid JSON file.")
        }

        data = {}
    }

    data = merge(data, config) as VsCodeSetting

    await writeFile(".vscode/settings.json", JSON.stringify(data, null, 4))

    return data
}

export interface NodeError {
    code?: string
}

function isNodeError(error: unknown): error is NodeError {
    return typeof error === "object" && error !== null
}
