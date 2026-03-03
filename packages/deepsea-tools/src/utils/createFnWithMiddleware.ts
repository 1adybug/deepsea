import { assignFnName } from "./assignFnName"

export type AnyFunction = (...args: any[]) => any

export type NextFunction = () => Promise<void>

type AnyContext = Record<string, unknown>

type BaseContext<TFn extends AnyFunction = AnyFunction> = {
    fn: TFn
    args: Parameters<TFn>
    result?: Awaited<ReturnType<TFn>>
}

export type Context<TFn extends AnyFunction = AnyFunction, TContext extends AnyContext = {}> = Partial<Omit<TContext, keyof BaseContext<TFn>>> &
    BaseContext<TFn> & {
        [key: string]: unknown
    }

export type Middleware<TFn extends AnyFunction = AnyFunction, TContext extends AnyContext = {}> = (
    context: Context<TFn, TContext>,
    next: NextFunction,
) => void | Promise<void>

const globalMiddlewares: Middleware[] = []

export interface FnWithMiddleware<TFn extends AnyFunction = AnyFunction, TContext extends AnyContext = {}> {
    (...args: Parameters<TFn>): Promise<Awaited<ReturnType<TFn>>>
    use(middleware: Middleware<TFn, TContext>): this
}

const fnWithMiddlewareSymbol = Symbol("fnWithMiddleware")

export function isFnWithMiddleware(fn: unknown): fn is FnWithMiddleware {
    return typeof fn === "function" && (fn as any)[fnWithMiddlewareSymbol] === true
}

export interface CreateFnWithMiddlewareOptions<TFn extends AnyFunction = AnyFunction, TContext extends AnyContext = {}> {
    /**
     * 可以改用自定义的全局中间件
     *
     * 修改以后，该函数的全局中间件的管理将由用户自己维护
     */
    global?: Middleware<TFn, TContext>[]
}

/**
 * 为函数创建一个支持中间件的包装函数。
 *
 * 中间件按洋葱模型执行：
 * - 在中间件中使用 `await next()` 可以继续执行后续中间件和原函数
 * - `await next()` 之后的逻辑会在内层执行完成后继续执行
 * - 不调用 `next()` 会短路，后续中间件和原函数都不会执行
 *
 * `context` 默认包含：
 * - `fn`: 当前被包装的原函数
 * - `args`: 当前调用参数
 * - `result`: 原函数或中间件写入的返回值
 *
 * 可以通过 `TContext` 为 `context` 扩展额外字段的类型声明。
 * 这些字段默认不是预先初始化的，需要由中间件自行赋值。
 *
 * @example
 * const fn = createFnWithMiddleware(async (id: number) => ({ id }))
 *
 * fn.use(async (context, next) => {
 *     console.log("before", context.args[0])
 *     await next()
 *     console.log("after", context.result)
 * })
 */
export function createFnWithMiddleware<TFn extends AnyFunction = AnyFunction, TContext extends AnyContext = {}>(
    fn: TFn,
    { global = globalMiddlewares as Middleware<TFn, TContext>[] }: CreateFnWithMiddlewareOptions<TFn, TContext> = {},
): FnWithMiddleware<TFn, TContext> {
    const middlewares: Middleware<TFn, TContext>[] = []

    async function fnWithMiddleware(...args: Parameters<TFn>): Promise<Awaited<ReturnType<TFn>>> {
        const allMiddlewares = [...global, ...middlewares]

        if (allMiddlewares.length === 0) return await fn(...args)

        const context = {
            fn,
            args,
            result: undefined,
        } as Context<TFn, TContext>

        async function execute(index: number): Promise<void> {
            if (index >= allMiddlewares.length) {
                context.result = await context.fn(...context.args)
                return
            }

            const middleware = allMiddlewares[index]
            let executed = false
            let nextPromise: Promise<void> | undefined

            async function next() {
                if (executed) throw new Error("The next function can only be called once.")

                executed = true
                nextPromise = execute(index + 1)
                return await nextPromise
            }

            await middleware(context, next)
            if (nextPromise) await nextPromise
        }

        await execute(0)

        return context.result as Awaited<ReturnType<TFn>>
    }

    assignFnName(fnWithMiddleware, fn)
    Object.defineProperty(fnWithMiddleware, fnWithMiddlewareSymbol, { value: true })

    fnWithMiddleware.use = function use(middleware: Middleware<TFn, TContext>) {
        middlewares.push(middleware)
        return fnWithMiddleware
    }

    return fnWithMiddleware
}

createFnWithMiddleware.use = function use(middleware: Middleware) {
    globalMiddlewares.push(middleware)
    return createFnWithMiddleware
}
