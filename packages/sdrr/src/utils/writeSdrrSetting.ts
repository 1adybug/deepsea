import { writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

import { SdrrSetting } from "./readSdrrSetting"

export async function writeSdrrSetting(setting: SdrrSetting) {
    const userDir = homedir()
    const settingPath = join(userDir, ".sdrr.json")
    await writeFile(settingPath, JSON.stringify(setting, undefined, 4), "utf-8")
}
