import { SpawnOptions, SpawnOptionsWithStdioTuple, SpawnOptionsWithoutStdio, StdioNull, StdioPipe, spawn } from "child_process"

export function spawnAsync(command: string, options?: SpawnOptionsWithoutStdio): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>): Promise<void>
export function spawnAsync(command: string, options: SpawnOptions): Promise<void>
export function spawnAsync(command: string, args?: readonly string[], options?: SpawnOptionsWithoutStdio): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>): Promise<void>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptions): Promise<void>
export async function spawnAsync(command: string, args?: any, options?: any) {
    await new Promise<void>((resolve, reject) => {
        const child = spawn(command, args, options)
        child.on("exit", code => {
            if (code !== 0) {
                reject(new Error(`"${command}" Command failed with code ${code}`))
                return
            }
            resolve()
        })
    })
}
