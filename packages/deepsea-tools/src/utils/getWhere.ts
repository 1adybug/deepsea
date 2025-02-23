type StringKey<T, K extends keyof T = keyof T> = K extends keyof T ? (Exclude<T[K], undefined> extends string ? K : never) : never

type ArrayKey<T, K extends keyof T = keyof T> = K extends keyof T ? (Exclude<T[K], undefined> extends (number | Date | undefined)[] ? K : never) : never

export type Where<T extends Record<string, any>, P extends StringKey<T>> = {
    AND?: Record<Exclude<StringKey<T>, P>, { contains: string }>[]
} & Omit<T, Exclude<StringKey<T>, P> | ArrayKey<T>> & {
        [K in ArrayKey<T>]: { gte?: Exclude<Exclude<T[K], undefined>[0], undefined>; lte?: Exclude<Exclude<T[K], undefined>[0], undefined> }
    }

/**
 * 获取 prisma 的 where 条件， 如果 value 是数组，则表示范围查询，会自动生成大于等于第1个元素，小于等于第2个元素的条件
 * @param params - 参数
 * @param keys - 精准匹配的 key，非字符串类型的会自动精准匹配，不需要传入
 * @param exact - 传入 keys 是否是精准匹配，默认为 true
 */
export function getWhere<T extends Record<string, any>, K extends StringKey<T> = never, E extends boolean = true>(
    params: T,
    keys: K[] = [],
    exact: E = true as E,
) {
    type P = E extends true ? K : Exclude<StringKey<T>, K>
    return Object.entries(params).reduce(
        (acc, [key, value]) => {
            if (value === undefined) return acc
            if (Array.isArray(value) && value.every(item => item === undefined || typeof item === "number" || item instanceof Date))
                acc[key as ArrayKey<T>] = { gte: value.at(0), lte: value.at(1) } as any
            else if (keys.includes(key as K) === exact || typeof value !== "string") acc[key as keyof typeof acc] = value as any
            else {
                const contains = Array.from(new Set(value.split(" ").filter(Boolean))).map(item => ({ [key]: { contains: item } }))
                if (contains.length === 0) return acc
                acc.AND ??= []
                acc.AND.push(...(contains as any))
            }
            return acc
        },
        {} as unknown as Where<T, P>,
    )
}
