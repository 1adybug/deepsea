import { RefObject, useEffect, useState } from "react"
import { getElement, useSize } from "soda-hooks"

interface Elements {
    container?: Element | null
    thead?: Element | null
    pagination?: Element | null
}

export interface UseScrollYOptions {
    interval?: number
    paginationMargin?: number
}

export function useScrollY<T extends Element>(
    container: T | null | undefined | RefObject<T | null | undefined> | string,
    { interval = 500, paginationMargin = 0 }: UseScrollYOptions = {},
) {
    const [elements, setElements] = useState<Elements>()
    const size = useSize(elements?.container)
    const theadSize = useSize(elements?.thead)
    const paginationSize = useSize(elements?.pagination)

    useEffect(() => {
        function getElements() {
            const containerEle = getElement(container)
            if (!containerEle) return
            const theadEle = containerEle.querySelector(".ant-table-thead")
            const paginationEle = containerEle.querySelector(".ant-pagination")
            setElements(prev => {
                if (prev?.container === containerEle && prev?.thead === theadEle && prev?.pagination === paginationEle) return prev
                return { container: containerEle, thead: theadEle, pagination: paginationEle }
            })
        }

        const timer = setInterval(() => {
            getElements()
        }, interval)

        return () => clearInterval(timer)
    }, [container, interval])

    return size ? size.height - (theadSize?.height || 0) - (paginationSize?.height || 0) - paginationMargin : 0
}
