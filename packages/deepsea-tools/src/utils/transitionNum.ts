import { setFrameInterval } from "./setFrameInterval"
import { twoNumberIsEqual } from "./twoNumberIsEqual"

export interface TransitionNumConfig {
    target: number
    /** 每一帧变化的数字 */
    speed: number
}

export class TransitionNum {
    #target: number
    #speed: number
    #current: number
    #clear?: () => void
    equal = twoNumberIsEqual

    constructor({ target, speed }: TransitionNumConfig) {
        this.#target = target
        this.#speed = Math.abs(speed)
        this.#current = target
    }

    get target() {
        return this.#target
    }

    set target(target) {
        if (this.equal(this.#target, target)) {
            this.#target = target
            return
        }

        this.#target = target

        if (this.equal(this.#target, this.#current)) {
            this.#clear?.()
            return
        }

        this.#clear = setFrameInterval(() => {
            const a = this.#current
            const bigger = this.#target > this.#current

            if (bigger) this.#current += this.#speed
            else this.#current -= this.#speed

            if (this.equal(this.#target, this.#current) || this.#current > this.#target === bigger) {
                this.#current = this.#target
                this.#clear?.()
            }

            this.#listeners.forEach(listener => {
                listener.call(this, this.#current, a)
            })
        }, 1)
    }

    get speed() {
        return this.#speed
    }

    set speed(speed) {
        this.#speed = Math.abs(speed)
    }

    get current() {
        return this.#current
    }

    #listeners = new Set<(this: TransitionNum, current: number, prev: number) => void>()

    subscribe(listener: (this: TransitionNum, current: number, prev: number) => void) {
        this.#listeners.add(listener)
        return () => this.#listeners.delete(listener)
    }

    unsubscribe(listener: (this: TransitionNum, current: number, prev: number) => void) {
        this.#listeners.delete(listener)
    }

    destroy() {
        this.#clear?.()
    }
}
