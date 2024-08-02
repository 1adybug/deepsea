import { useEffect, useRef } from "react"

/**
 * 用于在页面加载时自动播放视频
 */
export function useAutoPlay() {
    const video = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const play = () => video.current?.play()
        window.addEventListener("click", play, { once: true })
        return () => window.removeEventListener("click", play)
    }, [])

    return video
}
