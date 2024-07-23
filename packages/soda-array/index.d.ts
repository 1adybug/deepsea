interface Array<T> {
    with(this: Array<T>, index: number, value: T): Array<T>
    toReversed(this: Array<T>): Array<T>
    toShifted(this: Array<T>): Array<T>
    toPopped(this: Array<T>): Array<T>
    toSorted(this: Array<T>, compareFn?: (a: T, b: T) => number): Array<T>
    toSpliced(this: Array<T>, start: number, deleteCount?: number, ...items: T[]): Array<T>
    toPushed(this: Array<T>, ...items: T[]): Array<T>
    toUnshifted(this: Array<T>, ...items: T[]): Array<T>
    toExchange(this: Array<T>, a: number, b: number): Array<T>
    toDeduplicated(this: Array<T>, compareFn?: (a: T, b: T) => boolean): Array<T>
    /** at() 方法接收一个整数值并返回该索引对应的元素，允许正数和负数。负整数从数组中的最后一个元素开始倒数 */
    at(this: Array<T>, index: number): T | undefined
    /** 将数组（array）拆分成多个 size 长度的区块，并将这些区块组成一个新数组。 如果array 无法被分割成全部等长的区块，那么最后剩余的元素将组成一个区块 */
    chunk(this: Array<T>, size: number): Array<Array<T>>
    /** 获取数组中的非空集合 */
    nonNullable(this: Array<T>): Array<NonNullable<T>>
    /** 将数组当做非空集合，注意返回的数组还是本身，不做任何改变，仅为了通过 TypeScript 校验 */
    asNonNullable(this: Array<T>): Array<NonNullable<T>>
    /** 求数组与另外一个数组的差集 */
    difference(this: Array<T>, values: Array<T>, compareFn?: (a: T, b: T) => boolean): Array<T>
    /** 求数组与另外一个数组的交集 */
    intersection(this: Array<T>, values: Array<T>, compareFn?: (a: T, b: T) => boolean): Array<T>
    /** 求数组与另外一个数组的合集 */
    union(this: Array<T>, values: Array<T>, compareFn?: (a: T, b: T) => boolean): Array<T>
    /** 获取数组中的随机一个元素 */
    random(this: Array<T>, start?: number, end?: number): T
}

declare interface Window {
    Array: Array
}
