import { join, normalize, resolve } from "node:path"
import { cwd } from "node:process"

export interface SdrrOptions {
    root?: string
    appDir?: string
    routerOutputPath?: string
    updateVsCodeSettings?: boolean
}

export interface ResolvedSdrrOptions {
    root: string
    appDir: string
    routerOutputPath: string
    updateVsCodeSettings: boolean
}

export function resolveSdrrOptions(options: SdrrOptions = {}): ResolvedSdrrOptions {
    return {
        root: resolve(options.root ?? cwd()),
        appDir: normalizeProjectPath(options.appDir ?? "app"),
        routerOutputPath: normalizeProjectPath(options.routerOutputPath ?? join("components", "Router.tsx")),
        updateVsCodeSettings: options.updateVsCodeSettings ?? false,
    }
}

export function resolveSdrrPath({ root }: Pick<ResolvedSdrrOptions, "root">, path: string) {
    return resolve(root, path)
}

function normalizeProjectPath(path: string) {
    const normalized = normalize(path).replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/$/, "")

    if (!normalized || normalized === ".") throw new Error("sdrr 的路径配置不能为空。")

    return normalized
}
