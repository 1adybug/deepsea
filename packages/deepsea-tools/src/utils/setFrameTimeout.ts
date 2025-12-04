/**
 * 帧数定时器
 * @param callback 回调函数
 * @param frames 帧数，必须是 0 或者正整数
 * @returns 清除定时器函数
 */
export function setFrameTimeout(callback: () => void, frames: number): () => void {
    if (!Number.isInteger(frames) || frames < 0) throw new RangeError("帧数只支持 0 或者正整数")
    let current = 0
    let signal = 0

    function clearFrameTimeout() {
        cancelAnimationFrame(signal)
    }

    function run() {
        signal = requestAnimationFrame(() => {
            run()

            if (current++ >= frames) {
                callback()
                return
            }
        })
    }

    run()
    return clearFrameTimeout
}
