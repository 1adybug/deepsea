import { ChildProcess, spawn } from "child_process"

export interface SpawnCommandParams {
    args: string[]
}

export function spawnCommand({ args }: SpawnCommandParams) {
    const [command, ...commandArgs] = args

    return spawn(command, commandArgs, {
        shell: true,
        stdio: "inherit",
    })
}

export async function runCommand({ args }: SpawnCommandParams) {
    if (args.length === 0) return 0

    const child = spawnCommand({ args })
    return waitForChild(child)
}

export async function waitForChild(child: ChildProcess) {
    return await new Promise<number>((resolve, reject) => {
        child.once("error", reject)
        child.once("close", (code, signal) => {
            if (typeof code === "number") {
                resolve(code)
                return
            }

            resolve(signal ? 1 : 0)
        })
    })
}
