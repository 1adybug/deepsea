import {
    ChildProcess,
    ChildProcessByStdio,
    ChildProcessWithoutNullStreams,
    spawn,
    SpawnOptions,
    SpawnOptionsWithoutStdio,
    SpawnOptionsWithStdioTuple,
    StdioNull,
    StdioPipe,
} from "child_process"
import { Readable, Writable } from "stream"

export interface PromiseWithChildProcess<T> extends Promise<T> {
    child: T
}

export type Options =
    | SpawnOptionsWithoutStdio
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>
    | SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>
    | SpawnOptions

let defaultOptions: Options = {}

/**
 * @description get default options for spawnAsync
 * @returns {Options} options
 */
export function getDefaultOptions(): Options {
    return defaultOptions
}

/**
 * @description set default options for spawnAsync
 * @param  {Options | ((prev: Options) => Options)} options
 */
export function setDefaultOptions(options: Options | ((prev: Options) => Options)) {
    if (typeof options === "function") {
        defaultOptions = options(defaultOptions)
        return
    }

    defaultOptions = options
    return defaultOptions
}

export function spawnAsync(command: string, options?: SpawnOptionsWithoutStdio): PromiseWithChildProcess<ChildProcessWithoutNullStreams>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, Readable, Readable>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, Readable, null>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, null, Readable>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<null, Readable, Readable>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, null, null>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<null, Readable, null>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<null, null, Readable>>
export function spawnAsync(
    command: string,
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<null, null, null>>
export function spawnAsync(command: string, options: SpawnOptions): PromiseWithChildProcess<ChildProcess>
export function spawnAsync(
    command: string,
    args?: readonly string[],
    options?: SpawnOptionsWithoutStdio,
): PromiseWithChildProcess<ChildProcessWithoutNullStreams>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, Readable, Readable>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioPipe, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, Readable, null>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, null, Readable>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<null, Readable, Readable>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioPipe, StdioNull, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<Writable, null, null>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioPipe, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<null, Readable, null>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioPipe>,
): PromiseWithChildProcess<ChildProcessByStdio<null, null, Readable>>
export function spawnAsync(
    command: string,
    args: readonly string[],
    options: SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>,
): PromiseWithChildProcess<ChildProcessByStdio<null, null, null>>
export function spawnAsync(command: string, args: readonly string[], options: SpawnOptions): PromiseWithChildProcess<ChildProcess>

/**
 * @description wait for the command to exit
 * @returns a promise that resolves with the child process when the command exits successfully. Also, the child process is attached to the promise as a property.
 */
export function spawnAsync(command: string, args?: any, options?: any): Promise<any> {
    let child: any
    const promise = new Promise<any>((resolve, reject) => {
        if (Array.isArray(args)) options = { ...defaultOptions, ...options }
        else args = { ...defaultOptions, ...args }

        child = spawn(command, args, options)

        child.on("exit", (code: number) => {
            if (code === 0) return resolve(child)

            if (Array.isArray(args)) {
                const args2 = args.map((item: string) => item.trim()).filter(Boolean)
                if (args2.length > 0) command = `${command} ${args2.join(" ")}`
            }

            reject(new Error(`spawn "${command}" failed with code ${code}`))
            return
        })
    }) as PromiseWithChildProcess<any>
    promise.child = child
    return promise
}
