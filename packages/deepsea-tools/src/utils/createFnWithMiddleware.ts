import { assignFnName } from "./assignFnName"

export type AnyFunction = (...args: any[]) => any

export type NextFunction = () => Promise<void>

export type Context<T extends AnyFunction = AnyFunction> = {
    fn: T
    arguments: Parameters<T>
    result?: Awaited<ReturnType<T>>
    [key: string]: any
}

export type Middleware<T extends AnyFunction = AnyFunction> = (context: Context<T>, next: NextFunction) => void | Promise<void>

const globalMiddlewares: Middleware[] = []

export interface FnWithMiddleware<T extends AnyFunction = AnyFunction> {
    (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>>
    use(middleware: Middleware<T>): this
}

const fnWithMiddlewareSymbol = Symbol("fnWithMiddleware")

export function isFnWithMiddleware(fn: unknown): fn is FnWithMiddleware {
    return typeof fn === "function" && (fn as any)[fnWithMiddlewareSymbol] === true
}

export interface CreateFnWithMiddlewareOptions {
    /**
     * 可以改用自定义的全局中间件
     *
     * 修改以后，该函数的全局中间件的管理将由用户自己维护
     */
    global?: Middleware[]
}

export function createFnWithMiddleware<T extends AnyFunction = AnyFunction>(
    fn: T,
    { global = globalMiddlewares }: CreateFnWithMiddlewareOptions = {},
): FnWithMiddleware<T> {
    const middlewares: Middleware<T>[] = []

    async function fnWithMiddleware(...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> {
        const allMiddlewares = [...global, ...middlewares] as Middleware[]

        if (allMiddlewares.length === 0) return await fn(...args)

        const context: Context<T> = {
            fn,
            arguments: args,
            result: undefined,
        }

        async function execute(index: number) {
            const middleware = allMiddlewares[index]
            let executed = false
            async function next() {
                if (executed) {
                    console.error("The next function can only be called once.")
                    return
                }
                executed = true
                if (index < allMiddlewares.length - 1) {
                    await execute(index + 1)
                    return
                }
                context.result = await context.fn(...context.arguments)
            }
            await middleware(context, next)
            if (!executed) await next()
        }

        await execute(0)

        return context.result as Awaited<ReturnType<T>>
    }

    assignFnName(fnWithMiddleware, fn)
    Object.defineProperty(fnWithMiddleware, fnWithMiddlewareSymbol, { value: true })

    fnWithMiddleware.use = function use(middleware: Middleware<T>) {
        middlewares.push(middleware)
        return fnWithMiddleware
    }

    return fnWithMiddleware
}

createFnWithMiddleware.use = function use(middleware: Middleware) {
    globalMiddlewares.push(middleware)
    return createFnWithMiddleware
}
