import { Page } from "./getPagination"

export async function getAll<T>(query: (time: number) => Promise<Page<T>>) {
    const result: T[] = []
    let time = 1
    while (true) {
        const response = await query(time)
        result.push(...response.list)
        if (!response.hasNextPage) break
        time++
    }
    return result
}
