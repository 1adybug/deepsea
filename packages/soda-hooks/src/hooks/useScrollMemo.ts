import { RefObject, useEffect } from "react"

export interface ScrollMemoOptions {
    /** 需要监听的元素，可以是 ref */
    target: HTMLElement | null | RefObject<HTMLElement | null>
    /** 用于存储位置的存储器，默认是 sessionStorage */
    storage?: Storage
    /** 存储位置的 key */
    key: string
    /** 是否已经准备好 */
    ready?: boolean
    /** 是否延迟滚动，这对于一些重绘需要时间的场景很有用 */
    delay?: number
    /** 滚动行为 */
    behavior?: ScrollBehavior
}

export function useScrollMemo(options: ScrollMemoOptions) {
    const { target, storage = sessionStorage, key, ready = true, delay, behavior } = options

    useEffect(() => {
        if (!ready) return
        if (target === null) return
        const element = target instanceof HTMLElement ? target : target.current
        if (element === null) return
        let timeout: any = undefined

        try {
            const value = storage.getItem(key)
            if (value === null) throw new Error()
            const { left, top } = JSON.parse(value)

            if (typeof left === "number" && typeof top === "number") {
                if (typeof delay !== "number" || Number.isNaN(delay) || delay <= 0) element.scrollTo({ left, top, behavior })
                else {
                    timeout = setTimeout(() => {
                        element.scrollTo({ left, top, behavior })
                    }, delay)
                }
            }
        } catch (error) {}

        function listener(e: Event) {
            const { scrollLeft, scrollTop } = e.target as HTMLElement
            storage.setItem(key, JSON.stringify({ left: scrollLeft, top: scrollTop }))
        }

        element.addEventListener("scroll", listener)
        return () => {
            clearTimeout(timeout)
            element.removeEventListener("scroll", listener)
        }
    }, [target, storage, key, ready, behavior])
}
