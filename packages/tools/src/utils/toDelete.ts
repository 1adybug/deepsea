export function toDelete<T>(set: Set<T>, item: T) {
    if (!set.has(item)) return set
    const newSet = new Set(set)
    newSet.delete(item)
    return newSet
}
