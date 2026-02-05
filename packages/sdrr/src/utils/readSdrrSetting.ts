import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

import { OperationType } from "./hook"

export interface SdrrSetting {
    hook?: Record<string, OperationType>
}

export async function readSdrrSetting(): Promise<SdrrSetting> {
    const userDir = homedir()
    const settingPath = join(userDir, ".sdrr.json")

    if (existsSync(settingPath)) {
        const setting = JSON.parse(await readFile(settingPath, "utf-8"))
        return setting
    }

    return {}
}
