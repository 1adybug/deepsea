import type { ArrayExtensions, ReadonlyArrayExtensions } from "./api.js"

declare global {
    interface Array<T> extends ArrayExtensions<T> {
        toSpliced(): T[]
        toSpliced(start: number): T[]
        toSpliced(start: number, deleteCount: number | undefined, ...items: T[]): T[]
    }

    interface ReadonlyArray<T> extends ReadonlyArrayExtensions<T> {
        toSpliced(): T[]
        toSpliced(start: number): T[]
        toSpliced(start: number, deleteCount: number | undefined, ...items: T[]): T[]
    }

    interface Window {
        Array: ArrayConstructor
    }

    interface ArrayConstructor {
        isTemplateObject(value: unknown): value is TemplateStringsArray
        fromAsync<T>(items: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>
        fromAsync<T, U>(
            items: AsyncIterable<T> | Iterable<T> | ArrayLike<T>,
            map: (value: Awaited<T>, index: number) => U,
            thisArg?: unknown,
        ): Promise<Awaited<U>[]>
    }
}

export {}
