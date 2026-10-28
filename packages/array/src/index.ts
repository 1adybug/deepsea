/** 为数组添加方法 */
export function extendArrayPrototype() {
    if (!Object.hasOwn(Array.prototype, "with")) {
        class A {
            static with<T>(this: T[], index: number, value: T): T[] {
                if (!Number.isInteger(index) || index >= this.length || index < this.length * -1) throw new RangeError(`Invalid index : ${index}`)
                const $ = this.slice()
                $[index >= 0 ? index : this.length + index] = value
                return $
            }
        }

        Array.prototype.with = A.with
    }

    if (!Object.hasOwn(Array.prototype, "toReversed")) {
        function toReversed<T>(this: T[]): T[] {
            const $ = this.slice()
            $.reverse()
            return $
        }

        Array.prototype.toReversed = toReversed
    }

    if (!Object.hasOwn(Array.prototype, "toShifted")) {
        function toShifted<T>(this: T[]): T[] {
            const $ = this.slice()
            $.shift()
            return $
        }

        Array.prototype.toShifted = toShifted
    }

    if (!Object.hasOwn(Array.prototype, "toPopped")) {
        function toPopped<T>(this: T[]): T[] {
            const $ = this.slice()
            $.pop()
            return $
        }

        Array.prototype.toPopped = toPopped
    }

    if (!Object.hasOwn(Array.prototype, "toSorted")) {
        function toSorted<T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
            const $ = this.slice()
            $.sort(compareFn)
            return $
        }

        Array.prototype.toSorted = toSorted
    }

    if (!Object.hasOwn(Array.prototype, "toDeduplicated")) {
        function toDeduplicated<T>(this: T[], compareFn?: (a: T, b: T) => boolean): T[] {
            return this.reduce((prev: T[], item: T) => {
                if (compareFn ? !prev.some(it => compareFn(it, item)) : !prev.includes(item)) prev.push(item)
                return prev
            }, [])
        }

        Array.prototype.toDeduplicated = toDeduplicated
    }

    if (!Object.hasOwn(Array.prototype, "toSpliced")) {
        function toSpliced<T>(this: T[], start: number, deleteCount?: number, ...items: T[]): T[] {
            const $ = this.slice()

            if (deleteCount === undefined) $.splice(start)
            else $.splice(start, deleteCount, ...items)

            return $
        }

        Array.prototype.toSpliced = toSpliced
    }

    if (!Object.hasOwn(Array.prototype, "toPushed")) {
        function toPushed<T>(this: T[], ...items: T[]): T[] {
            const $ = this.slice()
            $.push(...items)
            return $
        }

        Array.prototype.toPushed = toPushed
    }

    if (!Object.hasOwn(Array.prototype, "toUnshifted")) {
        function toUnshifted<T>(this: T[], ...items: T[]): T[] {
            const $ = this.slice()
            $.unshift(...items)
            return $
        }

        Array.prototype.toUnshifted = toUnshifted
    }

    if (!Object.hasOwn(Array.prototype, "toExchange")) {
        function toExchange<T>(this: T[], a: number, b: number): T[] {
            return this.with(a, this[b]).with(b, this[a])
        }

        Array.prototype.toExchange = toExchange
    }

    if (!Object.hasOwn(Array.prototype, "at")) {
        function at<T>(this: T[], index: number): T | undefined {
            if (!Number.isInteger(index)) throw new RangeError(`Invalid index : ${index}`)
            return this[index >= 0 ? index : this.length + index]
        }

        Array.prototype.at = at
    }

    if (!Object.hasOwn(Array.prototype, "chunk")) {
        Array.prototype.chunk = function chunk<T>(this: T[], size: number) {
            if (!Number.isInteger(size) || size <= 0) throw new RangeError(`Invalid size : ${size}`)
            return this.reduce((prev: T[][], item: T, index: number) => {
                if (index % size === 0) prev.push([item])
                else prev[prev.length - 1].push(item)

                return prev
            }, [])
        }
    }

    if (!Object.hasOwn(Array.prototype, "nonNullable")) {
        Array.prototype.nonNullable = function nonNullable<T>(this: T[]) {
            return this.filter(item => item !== undefined && item !== null)
        }
    }

    if (!Object.hasOwn(Array.prototype, "asNonNullable")) {
        Array.prototype.asNonNullable = function asNonNullable<T>(this: T[]) {
            return this
        }
    }

    if (!Object.hasOwn(Array.prototype, "difference")) {
        Array.prototype.difference = function difference<T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
            return this.filter(item => (compareFn ? !values.some(it => compareFn(it, item)) : !values.includes(item)))
        }
    }

    if (!Object.hasOwn(Array.prototype, "intersection")) {
        Array.prototype.intersection = function intersection<T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
            return this.filter(item => (compareFn ? values.some(it => compareFn(it, item)) : values.includes(item)))
        }
    }

    if (!Object.hasOwn(Array.prototype, "union")) {
        Array.prototype.union = function union<T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
            return this.concat(
                values.reduce((prev: T[], item) => {
                    if (compareFn ? !this.some(it => compareFn(it, item)) : !this.includes(item)) prev.push(item)
                    return prev
                }, []),
            )
        }
    }

    if (!Object.hasOwn(Array.prototype, "random")) {
        Array.prototype.random = function random<T>(this: Array<T>, start?: number, end?: number) {
            const arr = this.slice(start, end)
            if (arr.length === 0) throw new Error("cant random an empty array")
            return arr[Math.floor(Math.random() * arr.length)]
        }
    }
}
