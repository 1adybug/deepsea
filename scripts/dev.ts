import { spawn } from "node:child_process"
import { readdir, readFile } from "node:fs/promises"

async function main() {
    const dir = await readdir("packages")
    for (const item of dir) {
        const packageJSON = JSON.parse(await readFile(`packages/${item}/package.json`, "utf-8"))
        if (!packageJSON.devDependencies?.father) return
        spawn(`pnpm dev`, {
            cwd: `packages/${item}`,
            shell: true,
            stdio: "inherit"
        })
    }
}

main()
