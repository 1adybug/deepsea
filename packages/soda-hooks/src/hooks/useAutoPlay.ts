import { type RefObject, useRef } from "react"

import { useDomEffect } from "./useDomEffect"

/**
 * 用于在页面加载时自动播放视频
 */
export function useAutoPlay(): RefObject<HTMLVideoElement | null>
export function useAutoPlay(video: RefObject<HTMLVideoElement | null>): RefObject<HTMLVideoElement | null>
export function useAutoPlay(video?: RefObject<HTMLVideoElement | null>) {
    const ref = useRef<HTMLVideoElement | null>(null)
    const videoRef = video ?? ref

    useDomEffect(
        current => {
            if (!current) return
            const video = current

            async function play() {
                try {
                    await video.play()
                    window.removeEventListener("click", play)
                } catch {}
            }

            window.addEventListener("click", play)

            play()

            return () => window.removeEventListener("click", play)
        },
        [videoRef],
        [],
    )

    return videoRef
}
