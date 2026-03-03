import { readFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

import { OperationType } from "./hook"

export interface SdNextSetting {
    hook?: Record<string, OperationType>
}

export async function readSdNextSetting(): Promise<SdNextSetting> {
    const userDir = homedir()
    const settingPath = join(userDir, ".sdnext.json")

    try {
        const setting = JSON.parse(await readFile(settingPath, "utf-8")) as SdNextSetting
        return setting
    } catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") return {}

        console.warn(`Failed to read ${settingPath}, fallback to default setting.`)
        return {}
    }
}

export interface NodeError {
    code?: string
}

function isNodeError(error: unknown): error is NodeError {
    return typeof error === "object" && error !== null
}
