import { ChildProcess, spawn } from "child_process"

export interface SpawnCommandParams {
    args: string[]
}

function quotePosixArgument(arg: string) {
    if (arg.length === 0) return "''"

    return `'${arg.replaceAll("'", `'"'"'`)}'`
}

function quoteWindowsArgument(arg: string) {
    if (arg.length === 0) return '""'

    return `"${arg.replaceAll('"', '""')}"`
}

function quoteWindowsCommand(command: string) {
    if (/^[\w./:-]+$/.test(command)) return command

    return quoteWindowsArgument(command)
}

function formatShellCommand(args: string[]) {
    const [command, ...commandArgs] = args
    const quoteArgument = process.platform === "win32" ? quoteWindowsArgument : quotePosixArgument

    if (process.platform === "win32") {
        return [quoteWindowsCommand(command), ...commandArgs.map(quoteArgument)].join(" ")
    }

    return args.map(quoteArgument).join(" ")
}

export function spawnCommand({ args }: SpawnCommandParams) {
    const command = formatShellCommand(args)

    return spawn(command, {
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
