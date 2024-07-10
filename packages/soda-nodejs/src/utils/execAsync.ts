import { exec, ExecOptions } from "child_process"
import { ObjectEncodingOptions } from "fs"

export type ExecResult<T> = {
    stdout: T
    stderr: T
}

export async function execAsync(command: string): Promise<ExecResult<string>>
export async function execAsync(command: string, options: { encoding: "buffer" | null } & ExecOptions): Promise<ExecResult<Buffer>>
export async function execAsync(command: string, options: { encoding: BufferEncoding } & ExecOptions): Promise<ExecResult<string>>
export async function execAsync(command: string, options: { encoding: BufferEncoding } & ExecOptions): Promise<ExecResult<string | Buffer>>
export async function execAsync(command: string, options: ExecOptions): Promise<ExecResult<string>>
export async function execAsync(command: string, options: (ObjectEncodingOptions & ExecOptions) | undefined | null): Promise<ExecResult<string | Buffer>>
export async function execAsync(command: string, options?: any) {
    return await new Promise<ExecResult<string | Buffer>>((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return
            }
            resolve({ stdout, stderr })
        })
    })
}
