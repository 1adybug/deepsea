import { writeFile } from "node:fs/promises"

export async function writeCode(file: string, code: string) {
    await writeFile(file, code + "\n", "utf-8")
}
