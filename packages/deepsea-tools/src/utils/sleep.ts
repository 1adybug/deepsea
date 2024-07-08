/**
 * 休眠指定时间
 * @param time - 休眠的毫秒数
 * @returns Promise<1>
 */
export async function sleep(time: number): Promise<1> {
    return new Promise<1>(resolve => {
        setTimeout(() => {
            resolve(1)
        }, time)
    })
}
