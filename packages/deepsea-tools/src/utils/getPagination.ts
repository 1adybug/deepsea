import { getArray } from "./getArray"

export type Page<T> = {
    hasNextPage: boolean
    hasPreviousPage: boolean
    isFirstPage: boolean
    isLastPage: boolean
    list: T[]
    navigateFirstPage: number
    navigateLastPage: number
    navigatePages: number
    navigatepageNums: number[]
    nextPage: number
    pageNum: number
    pageSize: number
    pages: number
    prePage: number
    size: number
    total: number
    startRow: number
    endRow: number
}

export type PaginationConfig<T> = {
    data: T[]
    pageNum: number
    pageSize: number
}

export function getPagination<T>({ data, pageNum, pageSize }: PaginationConfig<T>): Page<T> {
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    const list = data.slice(start, end)
    const size = list.length
    const total = data.length
    const range = Math.floor(pageNum / 8)
    const hasNextPage = total > end
    const hasPreviousPage = start > 0
    const isFirstPage = pageNum === 1
    const isLastPage = size > 0 && !hasNextPage
    const navigateFirstPage = range * 8 + 1
    const navigateLastPage = range * 8 + 8
    const navigatePages = 8
    const navigatepageNums = getArray(8, index => range * 8 + index + 1)
    const prePage = pageNum - 1
    const nextPage = hasNextPage ? pageNum + 1 : 0
    const pages = Math.ceil(total / pageSize)
    const startRow = size > 0 ? start + 1 : 0
    const endRow = size > 0 ? start + size : 0

    return {
        hasNextPage,
        hasPreviousPage,
        isFirstPage,
        isLastPage,
        list,
        navigateFirstPage,
        navigateLastPage,
        navigatePages,
        navigatepageNums,
        prePage,
        nextPage,
        pageNum,
        pageSize,
        pages,
        size,
        total,
        startRow,
        endRow
    }
}
