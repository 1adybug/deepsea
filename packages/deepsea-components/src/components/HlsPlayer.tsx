"use client"

import { type ComponentProps, type FC, useEffect, useEffectEvent, useImperativeHandle, useRef } from "react"

import { optionalFn } from "deepsea-tools"
import Hls, { type ErrorData, ErrorTypes } from "hls.js"

export interface HlsPlayerProps extends Omit<ComponentProps<"video">, "children"> {
    onHlsError?: (data: ErrorData) => void
    onHlsUnsupported?: () => void
}

export const HlsPlayer: FC<HlsPlayerProps> = ({ ref, src: source, onHlsError, onHlsUnsupported, ...rest }) => {
    const video = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => video.current!, [])

    const src = source?.trim()
    const onHlsErrorLatest = useEffectEvent(optionalFn(onHlsError))
    const onHlsUnsupportedLatest = useEffectEvent(optionalFn(onHlsUnsupported))

    useEffect(() => {
        const { current: player } = video
        if (!player || !src) return

        let hls: Hls | null = null

        if (Hls.isSupported()) {
            const instance = new Hls()
            let hasRetriedNetworkError = false
            let hasRecoveredMediaError = false

            hls = instance
            instance.loadSource(src)
            instance.attachMedia(player)

            instance.on(Hls.Events.ERROR, (_event, data) => {
                onHlsErrorLatest(data)
                if (!data.fatal) return

                if (data.type === ErrorTypes.NETWORK_ERROR && !hasRetriedNetworkError) {
                    hasRetriedNetworkError = true
                    instance.startLoad()
                    return
                }

                if (data.type === ErrorTypes.MEDIA_ERROR && !hasRecoveredMediaError) {
                    hasRecoveredMediaError = true
                    instance.recoverMediaError()
                    return
                }

                instance.destroy()
                if (hls === instance) hls = null
            })
        } else if (player.canPlayType("application/vnd.apple.mpegurl")) player.src = src
        else onHlsUnsupportedLatest()

        return () => {
            hls?.destroy()
            player.removeAttribute("src")
            player.load()
        }
    }, [src])

    return <video ref={video} {...rest} />
}
