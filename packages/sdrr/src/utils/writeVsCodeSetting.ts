import { mkdir, readFile, writeFile } from "fs/promises"
import { join } from "path"

export async function writeVsCodeSetting(root: string, config: Record<string, any>) {
    const vscodeDir = join(root, ".vscode")
    const settingPath = join(vscodeDir, "settings.json")

    await mkdir(vscodeDir, { recursive: true })

    let data: Record<string, any>

    try {
        const json = await readFile(settingPath, "utf-8")
        data = JSON.parse(json)
    } catch (error) {
        data = {}
    }

    data = mergeRecord(data, config)

    await writeFile(settingPath, JSON.stringify(data, null, 4))

    return data
}

function mergeRecord(a: Record<string, any>, b: Record<string, any>) {
    const result: Record<string, any> = { ...a }

    for (const [key, value] of Object.entries(b)) {
        if (isPlainObject(result[key]) && isPlainObject(value)) result[key] = mergeRecord(result[key], value)
        else result[key] = value
    }

    return result
}

function isPlainObject(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value)
}
