export type ArrayReceiver<T> = ArrayLike<T>

export type Predicate<T> = (value: T, index: number, array: T[]) => unknown

export type Equality<T> = (existing: T, value: T) => boolean

export interface ArrayFunctions {
    at<T>(array: ArrayReceiver<T>, index: number): T | undefined
    concat<T>(array: ArrayReceiver<T>, ...items: (T | ConcatArray<T>)[]): T[]
    copyWithin<T>(array: T[], target: number, start: number, end?: number): T[]
    entries<T>(array: ArrayReceiver<T>): ArrayIterator<[number, T]>
    every<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): boolean
    fill<T>(array: T[], value: T, start?: number, end?: number): T[]
    filter<T, S extends T>(array: ArrayReceiver<T>, predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S[]
    filter<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): T[]
    filterOut<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): T[]
    filterReject<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): T[]
    find<T, S extends T>(array: ArrayReceiver<T>, predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S | undefined
    find<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): T | undefined
    findIndex<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): number
    findLast: ArrayFunctions["find"]
    findLastIndex: ArrayFunctions["findIndex"]
    flat<T, D extends number = 1>(array: T, depth?: D): FlatArray<T, D>[]
    flatMap<T, U>(array: ArrayReceiver<T>, callback: (value: T, index: number, array: T[]) => U | readonly U[], thisArg?: unknown): U[]
    forEach<T>(array: ArrayReceiver<T>, callback: (value: T, index: number, array: T[]) => void, thisArg?: unknown): void
    from: ArrayConstructor["from"]
    fromAsync<T>(items: AsyncIterable<T> | Iterable<T | PromiseLike<T>> | ArrayLike<T | PromiseLike<T>>): Promise<T[]>
    fromAsync<T, U>(
        items: AsyncIterable<T> | Iterable<T> | ArrayLike<T>,
        map: (value: Awaited<T>, index: number) => U,
        thisArg?: unknown,
    ): Promise<Awaited<U>[]>
    group<T, K extends PropertyKey>(array: ArrayReceiver<T>, callback: (value: T, index: number, array: T[]) => K, thisArg?: unknown): Partial<Record<K, T[]>>
    groupBy: ArrayFunctions["group"]
    groupToMap<T, K>(array: ArrayReceiver<T>, callback: (value: T, index: number, array: T[]) => K, thisArg?: unknown): Map<K, T[]>
    groupByToMap: ArrayFunctions["groupToMap"]
    includes<T>(array: ArrayReceiver<T>, value: T, fromIndex?: number): boolean
    indexOf<T>(array: ArrayReceiver<T>, value: T, fromIndex?: number): number
    isArray: ArrayConstructor["isArray"]
    isTemplateObject(value: unknown): value is TemplateStringsArray
    iterator<T>(array: ArrayReceiver<T>): ArrayIterator<T>
    join<T>(array: ArrayReceiver<T>, separator?: string): string
    keys<T>(array: ArrayReceiver<T>): ArrayIterator<number>
    lastIndex<T>(array: ArrayReceiver<T>): number
    lastItem<T>(array: ArrayReceiver<T>): T | undefined
    lastItem<T>(array: ArrayReceiver<T>, value: T): T
    lastIndexOf<T>(array: ArrayReceiver<T>, value: T, fromIndex?: number): number
    map<T, U>(array: ArrayReceiver<T>, callback: (value: T, index: number, array: T[]) => U, thisArg?: unknown): U[]
    of: ArrayConstructor["of"]
    pop<T>(array: T[]): T | undefined
    push<T>(array: T[], ...items: T[]): number
    reduce<T>(array: ArrayReceiver<T>, callback: (previous: T, value: T, index: number, array: T[]) => T): T
    reduce<T, U>(array: ArrayReceiver<T>, callback: (previous: U, value: T, index: number, array: T[]) => U, initial: U): U
    reduceRight: ArrayFunctions["reduce"]
    reverse<T>(array: T[]): T[]
    shift<T>(array: T[]): T | undefined
    slice<T>(array: ArrayReceiver<T>, start?: number, end?: number): T[]
    some<T>(array: ArrayReceiver<T>, predicate: Predicate<T>, thisArg?: unknown): boolean
    sort<T>(array: T[], compare?: (a: T, b: T) => number): T[]
    splice<T>(array: T[], start: number): T[]
    splice<T>(array: T[], start: number, deleteCount: number | undefined, ...items: T[]): T[]
    toLocaleString<T>(array: ArrayReceiver<T>, locales?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions & Intl.DateTimeFormatOptions): string
    toString<T>(array: ArrayReceiver<T>): string
    toReversed<T>(array: ArrayReceiver<T>): T[]
    toSorted<T>(array: ArrayReceiver<T>, compare?: (a: T, b: T) => number): T[]
    toSpliced<T>(array: ArrayReceiver<T>): T[]
    toSpliced<T>(array: ArrayReceiver<T>, start: number): T[]
    toSpliced<T>(array: ArrayReceiver<T>, start: number, deleteCount: number | undefined, ...items: T[]): T[]
    uniqueBy<T>(array: ArrayReceiver<T>, resolver?: ((value: T) => unknown) | null): T[]
    unshift<T>(array: T[], ...items: T[]): number
    values<T>(array: ArrayReceiver<T>): ArrayIterator<T>
    with<T>(array: ArrayReceiver<T>, index: number, value: T): T[]
    chunk<T>(array: ArrayReceiver<T>, size: number): T[][]
    nonNullable<T>(array: ArrayReceiver<T>): NonNullable<T>[]
    asNonNullable<T>(array: T[]): NonNullable<T>[]
    asNonNullable<T>(array: readonly T[]): readonly NonNullable<T>[]
    toShifted<T>(array: ArrayReceiver<T>): T[]
    toPopped<T>(array: ArrayReceiver<T>): T[]
    toPushed<T>(array: ArrayReceiver<T>, ...items: T[]): T[]
    toUnshifted<T>(array: ArrayReceiver<T>, ...items: T[]): T[]
    toExchange<T>(array: ArrayReceiver<T>, a: number, b: number): T[]
    toDeduplicated<T>(array: ArrayReceiver<T>, compare?: Equality<T>): T[]
    difference<T>(array: ArrayReceiver<T>, values: ArrayReceiver<T>, compare?: Equality<T>): T[]
    intersection<T>(array: ArrayReceiver<T>, values: ArrayReceiver<T>, compare?: Equality<T>): T[]
    union<T>(array: ArrayReceiver<T>, values: ArrayReceiver<T>, compare?: Equality<T>): T[]
    random<T>(array: ArrayReceiver<T>, start?: number, end?: number): T
}

export type ArrayMethod = keyof ArrayFunctions

export type VirtualMethod<K extends ArrayMethod> = K extends "lastIndex"
    ? (this: ArrayLike<unknown>) => number
    : K extends "lastItem"
      ? (this: ArrayLike<any>, value?: any) => any
      : K extends keyof Array<any>
        ? Array<any>[K]
        : ArrayFunctions[K] extends (array: any, ...args: infer Args) => infer Result
          ? (this: ArrayLike<any>, ...args: Args) => Result
          : never

export interface ArrayExtensions<T> {
    at(index: number): T | undefined
    with(index: number, value: T): T[]
    toReversed(): T[]
    toSorted(compare?: (a: T, b: T) => number): T[]
    toSpliced(): T[]
    toSpliced(start: number): T[]
    toSpliced(start: number, deleteCount: number | undefined, ...items: T[]): T[]
    findLast<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: unknown): S | undefined
    findLast(predicate: Predicate<T>, thisArg?: unknown): T | undefined
    findLastIndex(predicate: Predicate<T>, thisArg?: unknown): number
    chunk(size: number): T[][]
    nonNullable(): NonNullable<T>[]
    asNonNullable(): NonNullable<T>[]
    toShifted(): T[]
    toPopped(): T[]
    toPushed(...items: T[]): T[]
    toUnshifted(...items: T[]): T[]
    toExchange(a: number, b: number): T[]
    toDeduplicated(compare?: Equality<T>): T[]
    difference(values: ArrayReceiver<T>, compare?: Equality<T>): T[]
    intersection(values: ArrayReceiver<T>, compare?: Equality<T>): T[]
    union(values: ArrayReceiver<T>, compare?: Equality<T>): T[]
    random(start?: number, end?: number): T
    filterOut(predicate: Predicate<T>, thisArg?: unknown): T[]
    filterReject(predicate: Predicate<T>, thisArg?: unknown): T[]
    uniqueBy(resolver?: ((value: T) => unknown) | null): T[]
    group<K extends PropertyKey>(callback: (value: T, index: number, array: T[]) => K, thisArg?: unknown): Partial<Record<K, T[]>>
    groupBy<K extends PropertyKey>(callback: (value: T, index: number, array: T[]) => K, thisArg?: unknown): Partial<Record<K, T[]>>
    groupToMap<K>(callback: (value: T, index: number, array: T[]) => K, thisArg?: unknown): Map<K, T[]>
    groupByToMap<K>(callback: (value: T, index: number, array: T[]) => K, thisArg?: unknown): Map<K, T[]>
    readonly lastIndex: number
    lastItem: T | undefined
}

export interface ReadonlyArrayExtensions<T> extends Omit<ArrayExtensions<T>, "asNonNullable" | "lastItem" | "findLast" | "findLastIndex"> {
    asNonNullable(): readonly NonNullable<T>[]
    readonly lastItem: T | undefined
    findLast<S extends T>(predicate: (value: T, index: number, array: readonly T[]) => value is S, thisArg?: unknown): S | undefined
    findLast(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: unknown): T | undefined
    findLastIndex(predicate: (value: T, index: number, array: readonly T[]) => unknown, thisArg?: unknown): number
}
