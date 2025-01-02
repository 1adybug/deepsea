type StringKey<T, K extends keyof T = keyof T> = K extends keyof T ? (T[K] extends string ? K : never) : never

export type Where<T extends Record<string, any>, P extends StringKey<T>> = {
    AND: Record<Exclude<StringKey<T>, P>, { contains: string }>[]
} & Pick<T, Exclude<keyof T, Exclude<StringKey<T>, P>>>

/**
 * 获取 prisma 的 where 条件
 * @param params - 参数
 * @param exact - 精准匹配的 key，非字符串类型的会自动精准匹配，不需要传入
 */
export function getWhere<T extends Record<string, any>, P extends StringKey<T>>(params: T, exact: P[] = []) {
    return Object.entries(params).reduce(
        (prev, [key, value]) => {
            if (value === undefined) return prev
            if (exact.includes(key as P) || typeof value !== "string") prev[key as keyof typeof prev] = value as any
            else prev.AND.push(...(Array.from(new Set(value.split(" ").filter(Boolean))).map(item => ({ [key]: { contains: item } })) as any))
            return prev
        },
        { AND: [] } as unknown as Where<T, P>,
    )
}
