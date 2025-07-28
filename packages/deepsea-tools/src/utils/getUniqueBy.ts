export function getUniqueBy<Key extends string>(key: Key, fromEnd?: boolean): (item: Record<Key, any>, index: number, array: Record<Key, any>[]) => boolean
export function getUniqueBy<Item>(
    selector: (item: Item, index: number, array: Item[]) => any,
    fromEnd?: boolean,
): (item: Item, index: number, array: Item[]) => boolean
/**
 * 对数组进行去重的过滤器
 * @param keyOrSelector 元素的键或选择器
 * @param fromEnd 是否从后往前查找
 * @returns 过滤器
 */
export function getUniqueBy(keyOrSelector: string | ((item: any, index: number, array: any[]) => any), fromEnd?: boolean) {
    const selector = typeof keyOrSelector === "string" ? (item: any, index: number, array: any[]) => item[keyOrSelector] : keyOrSelector
    return function uniqueBy(item: any, index: number, array: any[]) {
        const value = selector(item, index, array)
        return fromEnd
            ? array.findLastIndex((item2, index2, array2) => selector(item2, index2, array2) === value) === index
            : array.findIndex((item2, index2, array2) => selector(item2, index2, array2) === value) === index
    }
}

export const uniqueById = getUniqueBy("id")
