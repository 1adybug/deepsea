import { EventEmitter } from "node:events"

import { afterEach, expect, it, vi } from "vitest"

import { syncRouter } from "../src/utils/syncRouter"
import { watchSdrr } from "../src/utils/watchSdrr"

const mocked = vi.hoisted(() => ({ watch: vi.fn() }))
vi.mock("chokidar", () => ({ watch: mocked.watch }))
vi.mock("../src/utils/syncRouter", () => ({ syncRouter: vi.fn() }))
afterEach(() => vi.clearAllMocks())

it("coalesces changes while generation runs and reports each completed sync", async () => {
    const emitter = new EventEmitter()
    mocked.watch.mockReturnValue(emitter)
    let complete!: (value: boolean) => void

    vi.mocked(syncRouter)
        .mockImplementationOnce(
            () =>
                new Promise(resolve => {
                    complete = resolve
                }),
        )
        .mockResolvedValue(false)

    const onSync = vi.fn()
    expect(watchSdrr({}, { onSync })).toBe(emitter)
    emitter.emit("ready")
    emitter.emit("all", "add", "one")
    emitter.emit("all", "change", "two")
    expect(syncRouter).toHaveBeenCalledTimes(1)
    complete(true)
    await vi.waitFor(() => expect(onSync).toHaveBeenCalledTimes(2))
    expect(syncRouter).toHaveBeenCalledTimes(2)
    expect(onSync.mock.calls).toEqual([[true], [false]])
})

it("allows disabling initial sync and recovers after a generation error", async () => {
    const emitter = new EventEmitter()
    mocked.watch.mockReturnValue(emitter)
    const failure = new Error("failed")
    vi.mocked(syncRouter).mockRejectedValueOnce(failure).mockResolvedValue(true)

    const onError = vi.fn(),
        onSync = vi.fn()

    watchSdrr({ syncOnStart: false }, { onError, onSync })
    emitter.emit("ready")
    expect(syncRouter).not.toHaveBeenCalled()
    emitter.emit("all")
    await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(failure))
    emitter.emit("all")
    await vi.waitFor(() => expect(onSync).toHaveBeenCalledWith(true))
})
