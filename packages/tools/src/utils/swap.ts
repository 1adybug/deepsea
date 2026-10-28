/**
 * 交换数组中的两个元素。
 *
 * @param array 需要交换元素的数组。
 * @param from 需要交换的元素的索引，可以为负数，负数表示从数组末尾开始计算。
 * @param to 需要交换的元素的索引，可以为负数，负数表示从数组末尾开始计算。
 * @returns 交换后的新数组。
 */
export function swap<T>(array: T[], from: number, to: number) {
    from = from < 0 ? array.length + from : from
    to = to < 0 ? array.length + to : to
    if (from < 0 || to < 0 || from >= array.length || to >= array.length || !Number.isInteger(from) || !Number.isInteger(to)) throw new Error("Invalid index")

    const newArray = [...array]

    const temp = newArray[from]
    newArray[from] = newArray[to]
    newArray[to] = temp
    return newArray
}
