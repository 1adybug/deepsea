/**
 * 帧数定时器
 * @param callback 回调函数
 * @param frames 帧数，必须是正整数
 * @returns 清除定时器函数
 */
export function setFrameInterval(callback: () => void, frames: number): () => void {
    if (!Number.isInteger(frames) || frames <= 0) throw new RangeError("帧数只支持正整数")
    let current = 0
    let signal = 0

    function clearFrameInterval() {
        cancelAnimationFrame(signal)
    }

    function run() {
        signal = requestAnimationFrame(() => {
            run()
            if (current++ % frames === 0) callback()
        })
    }

    run()
    return clearFrameInterval
}
