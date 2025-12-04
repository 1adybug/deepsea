/** 为数组添加方法 */
export function extendArrayPrototype() {
    if (!Array.prototype.hasOwnProperty("with")) {
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

    if (!Array.prototype.hasOwnProperty("toReversed")) {
        function toReversed<T>(this: T[]): T[] {
            const $ = this.slice()
            $.reverse()
            return $
        }

        Array.prototype.toReversed = toReversed
    }

    if (!Array.prototype.hasOwnProperty("toShifted")) {
        function toShifted<T>(this: T[]): T[] {
            const $ = this.slice()
            $.shift()
            return $
        }

        Array.prototype.toShifted = toShifted
    }

    if (!Array.prototype.hasOwnProperty("toPopped")) {
        function toPopped<T>(this: T[]): T[] {
            const $ = this.slice()
            $.pop()
            return $
        }

        Array.prototype.toPopped = toPopped
    }

    if (!Array.prototype.hasOwnProperty("toSorted")) {
        function toSorted<T>(this: T[], compareFn?: (a: T, b: T) => number): T[] {
            const $ = this.slice()
            $.sort(compareFn)
            return $
        }

        Array.prototype.toSorted = toSorted
    }

    if (!Array.prototype.hasOwnProperty("toDeduplicated")) {
        function toDeduplicated<T>(this: T[], compareFn?: (a: T, b: T) => boolean): T[] {
            return this.reduce((prev: T[], item: T) => {
                if (compareFn ? !prev.some(it => compareFn(it, item)) : !prev.includes(item)) prev.push(item)
                return prev
            }, [])
        }

        Array.prototype.toDeduplicated = toDeduplicated
    }

    if (!Array.prototype.hasOwnProperty("toSpliced")) {
        function toSpliced<T>(this: T[], start: number, deleteCount?: number, ...items: T[]): T[] {
            const $ = this.slice()

            if (deleteCount === undefined) $.splice(start)
            else $.splice(start, deleteCount, ...items)

            return $
        }

        Array.prototype.toSpliced = toSpliced
    }

    if (!Array.prototype.hasOwnProperty("toPushed")) {
        function toPushed<T>(this: T[], ...items: T[]): T[] {
            const $ = this.slice()
            $.push(...items)
            return $
        }

        Array.prototype.toPushed = toPushed
    }

    if (!Array.prototype.hasOwnProperty("toUnshifted")) {
        function toUnshifted<T>(this: T[], ...items: T[]): T[] {
            const $ = this.slice()
            $.unshift(...items)
            return $
        }

        Array.prototype.toUnshifted = toUnshifted
    }

    if (!Array.prototype.hasOwnProperty("toExchange")) {
        function toExchange<T>(this: T[], a: number, b: number): T[] {
            return this.with(a, this[b]).with(b, this[a])
        }

        Array.prototype.toExchange = toExchange
    }

    if (!Array.prototype.hasOwnProperty("at")) {
        function at<T>(this: T[], index: number): T | undefined {
            if (!Number.isInteger(index)) throw new RangeError(`Invalid index : ${index}`)
            return this[index >= 0 ? index : this.length + index]
        }

        Array.prototype.at = at
    }

    if (!Array.prototype.hasOwnProperty("chunk")) {
        Array.prototype.chunk = function chunk<T>(this: T[], size: number) {
            if (!Number.isInteger(size) || size <= 0) throw new RangeError(`Invalid size : ${size}`)
            return this.reduce((prev: T[][], item: T, index: number) => {
                if (index % size === 0) prev.push([item])
                else prev[prev.length - 1].push(item)

                return prev
            }, [])
        }
    }

    if (!Array.prototype.hasOwnProperty("nonNullable")) {
        Array.prototype.nonNullable = function nonNullable<T>(this: T[]) {
            return this.filter(item => item !== undefined && item !== null)
        }
    }

    if (!Array.prototype.hasOwnProperty("asNonNullable")) {
        Array.prototype.asNonNullable = function asNonNullable<T>(this: T[]) {
            return this
        }
    }

    if (!Array.prototype.hasOwnProperty("difference")) {
        Array.prototype.difference = function difference<T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
            return this.filter(item => (compareFn ? !values.some(it => compareFn(it, item)) : !values.includes(item)))
        }
    }

    if (!Array.prototype.hasOwnProperty("intersection")) {
        Array.prototype.intersection = function intersection<T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
            return this.filter(item => (compareFn ? values.some(it => compareFn(it, item)) : values.includes(item)))
        }
    }

    if (!Array.prototype.hasOwnProperty("union")) {
        Array.prototype.union = function union<T>(this: T[], values: T[], compareFn?: (a: T, b: T) => boolean) {
            return this.concat(
                values.reduce((prev: T[], item) => {
                    if (compareFn ? !this.some(it => compareFn(it, item)) : !this.includes(item)) prev.push(item)
                    return prev
                }, []),
            )
        }
    }

    if (!Array.prototype.hasOwnProperty("random")) {
        Array.prototype.random = function random<T>(this: Array<T>, start?: number, end?: number) {
            const arr = this.slice(start, end)
            if (arr.length === 0) throw new Error("cant random an empty array")
            return arr[Math.floor(Math.random() * arr.length)]
        }
    }
}
