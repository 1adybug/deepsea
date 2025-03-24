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
