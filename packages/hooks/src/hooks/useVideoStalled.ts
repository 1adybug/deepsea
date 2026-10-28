import { useEffectEvent } from "react"

import { type ElementInput, useDomEffect } from "./useDomEffect"

export interface UseVideoStalledParams {
    /**
     * 视频元素
     */
    video: ElementInput<HTMLVideoElement>
    /**
     * 视频停止输出新画面时触发，同一次卡顿只触发一次
     */
    onStalled: (video: HTMLVideoElement) => void
    /**
     * 连续多久没有输出新画面后判定为卡顿，单位为毫秒
     * @default 5000
     */
    timeout?: number
    /**
     * 是否启用监测
     * @default true
     */
    enabled?: boolean
}

/**
 * 监测视频在播放状态下是否停止输出新画面
 *
 * 优先通过 requestVideoFrameCallback 监测实际渲染的视频帧，浏览器不支持时
 * 退化为监测 timeupdate。主动暂停、播放结束、拖动进度以及页面不可见时不会触发。
 *
 */
export function useVideoStalled({ video, onStalled, timeout = 5000, enabled = true }: UseVideoStalledParams) {
    const onStalledLatest = useEffectEvent(onStalled)

    useDomEffect(
        current => {
            if (!enabled || !(current instanceof HTMLVideoElement)) return

            const video = current
            let timer: ReturnType<typeof setTimeout> | undefined
            let frameRequestId: number | undefined
            let reported = false
            let lastProgressAt = performance.now()
            const stalledTimeout = Math.max(0, timeout)

            function isPlaying() {
                return !video.paused && !video.ended && !video.seeking && document.visibilityState === "visible"
            }

            function clearTimer() {
                if (timer === undefined) return
                clearTimeout(timer)
                timer = undefined
            }

            function checkStalled() {
                timer = undefined
                if (reported || !isPlaying()) return

                const remaining = stalledTimeout - (performance.now() - lastProgressAt)

                if (remaining > 0) {
                    timer = setTimeout(checkStalled, remaining)
                    return
                }

                reported = true

                // eslint-disable-next-line
                onStalledLatest(video)
            }

            function startTimer() {
                if (timer !== undefined || reported || !isPlaying()) return
                const remaining = stalledTimeout - (performance.now() - lastProgressAt)
                timer = setTimeout(checkStalled, Math.max(0, remaining))
            }

            function onProgress() {
                reported = false
                lastProgressAt = performance.now()
                startTimer()
            }

            function onInactive() {
                reported = false
                clearTimer()
            }

            function onVisibilityChange() {
                if (document.visibilityState !== "visible") {
                    clearTimer()
                    return
                }

                lastProgressAt = performance.now()
                startTimer()
            }

            const supportsVideoFrameCallback = typeof video.requestVideoFrameCallback === "function" && typeof video.cancelVideoFrameCallback === "function"

            if (supportsVideoFrameCallback) {
                function onVideoFrame() {
                    onProgress()
                    frameRequestId = video.requestVideoFrameCallback(onVideoFrame)
                }

                frameRequestId = video.requestVideoFrameCallback(onVideoFrame)
            } else video.addEventListener("timeupdate", onProgress)

            video.addEventListener("play", onProgress)
            video.addEventListener("playing", onProgress)
            video.addEventListener("loadeddata", onProgress)
            video.addEventListener("seeked", onProgress)
            video.addEventListener("pause", onInactive)
            video.addEventListener("ended", onInactive)
            video.addEventListener("emptied", onInactive)
            video.addEventListener("seeking", onInactive)
            document.addEventListener("visibilitychange", onVisibilityChange)

            startTimer()

            return () => {
                clearTimer()
                if (frameRequestId !== undefined) video.cancelVideoFrameCallback(frameRequestId)
                if (!supportsVideoFrameCallback) video.removeEventListener("timeupdate", onProgress)
                video.removeEventListener("play", onProgress)
                video.removeEventListener("playing", onProgress)
                video.removeEventListener("loadeddata", onProgress)
                video.removeEventListener("seeked", onProgress)
                video.removeEventListener("pause", onInactive)
                video.removeEventListener("ended", onInactive)
                video.removeEventListener("emptied", onInactive)
                video.removeEventListener("seeking", onInactive)
                document.removeEventListener("visibilitychange", onVisibilityChange)
            }
        },
        [video],
        [enabled, timeout],
    )
}
