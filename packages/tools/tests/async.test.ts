import { afterEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import {
    createFnWithMiddleware,
    createRequestFn,
    isFnWithMiddleware,
    isRequestFn,
    resolveNull,
    setFrameInterval,
    setFrameTimeout,
    sleep,
    TransitionNum,
    whileDo,
} from "../src/index"

afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
})

describe("middleware and requests", () => {
    it("runs onion middleware in order and permits transforming args and result", async () => {
        const order: string[] = []

        const fn = createFnWithMiddleware(
            (value: number) => {
                order.push("fn")
                return value * 2
            },
            {
                global: [
                    async (_ctx, next) => {
                        order.push("global")
                        await next()
                        order.push("global-end")
                    },
                ],
            },
        )

        fn.use(async (ctx, next) => {
            order.push("local")
            ctx.args[0]++
            await next()
            ctx.result!++
            order.push("local-end")
        })

        expect(await fn(2)).toBe(7)
        expect(order).toEqual(["global", "local", "fn", "local-end", "global-end"])
        expect(isFnWithMiddleware(fn)).toBe(true)
        expect(isFnWithMiddleware(() => 1)).toBe(false)
    })

    it("short-circuits, guards duplicate next calls and propagates failures", async () => {
        const original = vi.fn(() => 1)

        const cached = createFnWithMiddleware(original, { global: [] }).use(ctx => {
            ctx.result = 9
        })

        expect(await cached()).toBe(9)
        expect(original).not.toHaveBeenCalled()

        const twice = createFnWithMiddleware(original, { global: [] }).use(async (_ctx, next) => {
            await next()
            await next()
        })

        await expect(twice()).rejects.toThrow("only be called once")
        const failure = new Error("failure")
        await expect(
            createFnWithMiddleware(
                () => {
                    throw failure
                },
                { global: [] },
            )(),
        ).rejects.toBe(failure)
    })

    it("creates independent context for concurrent calls and preserves function names", async () => {
        async function double(value: number) {
            return value * 2
        }

        const fn = createFnWithMiddleware.withContext<{ tag: number }>()(double, { global: [] })

        fn.use(async (ctx, next) => {
            ctx.tag = ctx.args[0]
            await next()
            expect(ctx.tag).toBe(ctx.args[0])
        })

        expect(await Promise.all([fn(1), fn(2)])).toEqual([2, 4])
        expect(fn.name).toBe("double")
    })

    it("validates and transforms request inputs before calling the implementation", async () => {
        const original = vi.fn((value: number) => ({ success: true, data: value + 1 }))
        const request = createRequestFn({ name: "save", fn: original, schema: z.coerce.number().int() })
        expect(await request("2" as never)).toBe(3)
        expect(original).toHaveBeenCalledWith(2)
        await expect(request("invalid" as never)).rejects.toMatchObject({ issues: [{ code: "invalid_type" }] })
        expect(original).toHaveBeenCalledTimes(1)
        expect(request.name).toBe("save")
        expect(request.preset(4).name).toBe("save")
        expect(await request.preset(4)()).toBe(5)
        expect(isRequestFn(request)).toBe(true)
        expect(isRequestFn(original)).toBe(false)
    })

    it("unwraps empty successes and preserves Error identity on failure", async () => {
        expect(await createRequestFn(() => undefined)()).toBeUndefined()
        expect(await createRequestFn(() => ({ success: true }))()).toBeUndefined()
        const failure = new Error("denied")
        await expect(createRequestFn(() => ({ success: false, message: failure }))()).rejects.toBe(failure)
        await expect(createRequestFn(() => ({ success: false, message: "denied" }))()).rejects.toThrow("denied")
    })
})

describe("scheduling", () => {
    function frames() {
        let sequence = 0
        const pending = new Map<number, FrameRequestCallback>()

        vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
            pending.set(++sequence, callback)
            return sequence
        })

        vi.stubGlobal("cancelAnimationFrame", (id: number) => pending.delete(id))
        return {
            pending,
            tick: () => {
                const callbacks = [...pending.values()]

                pending.clear()
                callbacks.forEach(callback => callback(0))
            },
        }
    }

    it("fires a frame timeout exactly once and leaves no scheduled callback", () => {
        const { pending, tick } = frames()
        const callback = vi.fn()
        setFrameTimeout(callback, 2)
        tick()
        tick()
        expect(callback).not.toHaveBeenCalled()
        tick()
        tick()
        expect(callback).toHaveBeenCalledTimes(1)
        expect(pending.size).toBe(0)
    })

    it("cancels frame timeouts and intervals", () => {
        const { pending, tick } = frames()
        const callback = vi.fn()
        const cancel = setFrameTimeout(callback, 0)
        cancel()
        tick()
        expect(callback).not.toHaveBeenCalled()
        const stop = setFrameInterval(callback, 2)
        tick()
        tick()
        tick()
        expect(callback).toHaveBeenCalledTimes(2)
        stop()
        tick()
        expect(pending.size).toBe(0)
    })

    it.each([-1, 1.5, NaN, Infinity])("rejects invalid frame counts %s", count => {
        expect(() => setFrameTimeout(() => {}, count)).toThrow(RangeError)
        expect(() => setFrameInterval(() => {}, count)).toThrow(RangeError)
    })

    it("retargets one animation loop, clamps overshoot and destroys its resources", () => {
        const { pending, tick } = frames()
        const transition = new TransitionNum({ target: 0, speed: 2 })
        const listener = vi.fn()
        const off = transition.subscribe(listener)
        transition.target = 5
        tick()
        expect(transition.current).toBe(2)
        transition.target = -1
        expect(pending.size).toBe(1)
        tick()
        tick()
        expect(transition.current).toBe(-1)
        expect(pending.size).toBe(0)
        expect(listener).toHaveBeenLastCalledWith(-1, 0)
        off()
        transition.speed = -3
        expect(transition.speed).toBe(3)
        transition.target = 10
        transition.destroy()
        expect(pending.size).toBe(0)
    })

    it("waits for sleep and evaluates conditional async actions once", async () => {
        vi.useFakeTimers()
        const done = vi.fn()
        const waiting = sleep(100).then(done)
        await vi.advanceTimersByTimeAsync(99)
        expect(done).not.toHaveBeenCalled()
        await vi.advanceTimersByTimeAsync(1)
        await waiting
        expect(await resolveNull()).toBeNull()
        const action = vi.fn(async () => 4)
        expect(await whileDo(false, action)()).toBeNull()
        expect(action).not.toHaveBeenCalled()
        expect(await whileDo(() => true, action)()).toBe(4)
    })
})
