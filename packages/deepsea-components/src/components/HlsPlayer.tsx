"use client"

import { ComponentProps, FC, useEffect, useImperativeHandle, useRef } from "react"

import Hls from "hls.js"

export interface HlsPlayerProps extends Omit<ComponentProps<"video">, "src" | "children"> {
    src: string
}

export const HlsPlayer: FC<HlsPlayerProps> = ({ ref, src, ...rest }) => {
    const video = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => video.current!, [])

    useEffect(() => {
        const { current: player } = video
        if (!player || !src) return

        let hls: Hls | null = null

        // 1. 优先检查是否支持 hls.js (MSE 模式)
        // 这将覆盖 Chrome, Firefox, Edge 等现代浏览器，绕过它们不成熟或过于严格的原生 HLS 引擎
        if (Hls.isSupported()) {
            hls = new Hls()
            hls.loadSource(src)
            hls.attachMedia(player)

            // 绑定错误监听以便调试
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.log(event)
                console.log(data)
            })
        }

        // 2. 只有在 hls.js 不可用时，才尝试原生播放 (主要针对 iOS Safari 和 macOS Safari)
        else if (player.canPlayType("application/vnd.apple.mpegurl")) player.src = src

        return () => {
            if (hls) hls.destroy()

            // 清理原生 src，防止切换地址时内存泄漏
            if (player) {
                player.src = ""
                player.load()
            }
        }
    }, [src])

    return <video ref={video} {...rest} />
}
