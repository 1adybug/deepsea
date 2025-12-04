export function getSample<T extends Record<string, any>>(data: T[], size?: number): T[] {
    size ??= data.length
    const keys = Object.keys(data[0])

    type Values = {
        [key in keyof T]: Map<T[key], number>
    }

    const values = Object.fromEntries(keys.map(key => [key, new Map()])) as Values
    data.forEach(item => Object.entries(item).forEach(([key, value]) => values[key].set(value, (values[key].get(value) || 0) + 1)))

    let sample: T[] = []

    while (sample.length < size && data.length > 0 && Object.values(values).some(value => value.size > 0)) {
        const item = data.toSorted(
            (a, b) =>
                Object.entries(b).reduce((acc, [key, value]) => acc + (values[key].get(value) ?? 0), 0) -
                Object.entries(a).reduce((acc, [key, value]) => acc + (values[key].get(value) ?? 0), 0),
        )[0]
        data = data.filter(i => i !== item)
        sample.push(item)
        Object.entries(item).map(([key, value]) => values[key].delete(value))
    }

    return sample
}
