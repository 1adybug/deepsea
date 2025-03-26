import { ElementInput, getElement, useSize } from "soda-hooks"

export interface UseScrollOptions {
    paginationMargin?: number
}

export function useScroll<T extends Element>(container: ElementInput<T>, { paginationMargin = 0 }: UseScrollOptions = {}) {
    const size = useSize(container)
    const theadSize = useSize(() => getElement(container)?.querySelector(".ant-table-thead"))
    const paginationSize = useSize(() => getElement(container)?.querySelector(".ant-pagination"))

    return {
        x: size?.width ?? 0,
        y: size ? size.height - (theadSize?.height || 0) - (paginationSize?.height || 0) - paginationMargin : 0,
    }
}
