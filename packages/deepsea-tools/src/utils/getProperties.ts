/**
 * 获取对象的某些属性
 * @param obj - 对象
 * @param keyList - 需要取出的 key 集合
 * @returns 对象的某些属性
 */
export function getProperties<T, K extends keyof T>(obj: T, ...keyList: K[]): Pick<T, K> {
    const result: any = {}
    keyList.forEach(key => {
        result[key] = obj[key]
    })
    return result
}
