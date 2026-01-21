import { writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"

import { SdNextSetting } from "./readSdNextSetting"

export async function writeSdNextSetting(setting: SdNextSetting) {
    const userDir = homedir()
    const settingPath = join(userDir, ".sdnext.json")
    await writeFile(settingPath, JSON.stringify(setting, undefined, 4), "utf-8")
}
