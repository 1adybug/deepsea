export function toAdd<T>(set: Set<T>, item: T) {
    if (set.has(item)) return set
    const newSet = new Set(set)
    newSet.add(item)
    return newSet
}
