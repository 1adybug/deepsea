import { ElementInput, getElement, useSize } from "soda-hooks"

export interface UseScrollOptions {
    paginationMargin?: number
}

export function useScroll<T extends Element>(container: ElementInput<T>, { paginationMargin = 0 }: UseScrollOptions = {}) {
    const containerEle = getElement(container)
    const theadEle = containerEle?.querySelector(".ant-table-thead")
    const paginationEle = containerEle?.querySelector(".ant-pagination")

    const size = useSize(containerEle)
    const theadSize = useSize(theadEle)
    const paginationSize = useSize(paginationEle)

    return {
        x: size?.width ?? 0,
        y: size ? size.height - (theadSize?.height || 0) - (paginationSize?.height || 0) - paginationMargin : 0,
    }
}
