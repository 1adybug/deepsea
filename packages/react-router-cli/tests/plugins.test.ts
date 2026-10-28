import { EventEmitter } from "node:events"

import { afterEach, expect, it, vi } from "vitest"

import { sdrrRsbuildPlugin } from "../src/rsbuild"
import { sdrrVitePlugin } from "../src/vite"

import { syncRouter } from "../src/utils/syncRouter"
import { watchSdrr } from "../src/utils/watchSdrr"

vi.mock("../src/utils/syncRouter", () => ({ syncRouter: vi.fn(async () => true) }))
vi.mock("../src/utils/watchSdrr", () => ({ watchSdrr: vi.fn() }))
afterEach(() => vi.clearAllMocks())

it("Vite synchronizes before build, reloads changed routes, invalidates modules and closes its watcher", async () => {
    const close = vi.fn(async () => {})
    const watcher = new EventEmitter() as EventEmitter & { close: typeof close }
    watcher.close = close
    vi.mocked(watchSdrr).mockReturnValue(watcher as never)
    const plugin = sdrrVitePlugin()
    await (plugin.buildStart as Function)()
    expect(syncRouter).toHaveBeenCalledTimes(1)

    const module = {},
        invalidateModule = vi.fn()

    const server = {
        hot: { send: vi.fn() },
        environments: { client: { moduleGraph: { getModulesByFile: () => new Set([module]), invalidateModule } } },
        httpServer: new EventEmitter(),
        config: { logger: { error: vi.fn() } },
    }

    const configuring = (plugin.configureServer as Function)(server)
    await vi.waitFor(() => expect(watchSdrr).toHaveBeenCalledTimes(1))
    watcher.emit("ready")
    await configuring
    const hooks = vi.mocked(watchSdrr).mock.lastCall![1]!
    await hooks.onSync!(false)
    expect(server.hot.send).not.toHaveBeenCalled()
    await hooks.onSync!(true)
    expect(invalidateModule).toHaveBeenCalledWith(module, expect.any(Set), expect.any(Number), true)
    expect(server.hot.send).toHaveBeenCalledWith(expect.objectContaining({ type: "full-reload" }))
    hooks.onError!(new Error("generation failed"))
    expect(server.config.logger.error).toHaveBeenCalledWith(expect.stringContaining("generation failed"))
    await (plugin.closeBundle as Function)()
    expect(close).toHaveBeenCalledTimes(1)
})

it("Rsbuild registers build, compile, reload and watcher cleanup hooks", async () => {
    const hooks: Record<string, Function> = {}

    const close = vi.fn(async () => {})
    vi.mocked(watchSdrr).mockReturnValue({ close } as never)

    const names = ["onBeforeBuild", "onAfterCreateCompiler", "onBeforeDevCompile", "onAfterDevCompile", "onBeforeStartDevServer", "onCloseDevServer", "onExit"]

    const api = Object.fromEntries(
        names.map(name => [
            name,
            (callback: Function) => {
                hooks[name] = callback
            },
        ]),
    )

    sdrrRsbuildPlugin().setup({ ...api, transform: vi.fn() } as never)
    await hooks.onBeforeBuild()
    expect(syncRouter).toHaveBeenCalled()

    const server = { sockWrite: vi.fn() }

    const cleanup = await hooks.onBeforeStartDevServer({ server })
    await vi.mocked(watchSdrr).mock.lastCall![1]!.onSync!(true)
    hooks.onAfterDevCompile({ isFirstCompile: false })
    expect(server.sockWrite).toHaveBeenCalledWith("full-reload")
    hooks.onAfterDevCompile({ isFirstCompile: false })
    expect(server.sockWrite).toHaveBeenCalledTimes(1)
    await cleanup()
    await hooks.onCloseDevServer()
    await hooks.onExit()
    expect(close).toHaveBeenCalledTimes(1)
})
