/**
 * 休眠指定时间
 * @param time - 休眠的毫秒数
 * @returns {Promise<number>}
 */
export async function sleep(time: number): Promise<number> {
    return new Promise<number>(resolve => setTimeout(() => resolve(time), time))
}
