import { exec, ExecOptions } from "child_process"
import { ObjectEncodingOptions } from "fs"

import iconv, { Options } from "iconv-lite"

export type IconvDecodeOptions = {
    encoding: string
    options?: Options
}

export async function execAsync(command: string): Promise<string>
export async function execAsync(command: string, options: { encoding: "buffer" | null } & ExecOptions): Promise<Buffer>
export async function execAsync(command: string, options: { encoding: "buffer" | null } & ExecOptions & { decode: IconvDecodeOptions }): Promise<string>
export async function execAsync(command: string, options: { encoding: BufferEncoding } & ExecOptions): Promise<string>
export async function execAsync(command: string, options: { encoding: BufferEncoding } & ExecOptions): Promise<string | Buffer>
export async function execAsync(command: string, options: { encoding: BufferEncoding } & ExecOptions & { decode: IconvDecodeOptions }): Promise<string>
export async function execAsync(command: string, options: ExecOptions): Promise<string>
export async function execAsync(command: string, options: (ObjectEncodingOptions & ExecOptions) | undefined | null): Promise<string | Buffer>
export async function execAsync(
    command: string,
    options: (ObjectEncodingOptions & ExecOptions & { decode: IconvDecodeOptions }) | undefined | null,
): Promise<string>
export async function execAsync(command: string, options?: any) {
    const decode = options?.decode as IconvDecodeOptions | undefined

    if (typeof options === "object" && options !== null && options.decode) {
        const { decode, ...rest } = options as { decode: IconvDecodeOptions }
        options = rest
    }

    return await new Promise<string | Buffer>((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) return reject(error)

            // if (stderr) console.warn(stderr)
            if (decode && stdout instanceof Buffer) return resolve(iconv.decode(stdout, decode.encoding, decode.options))

            resolve(stdout)
        })
    })
}
