"use client"

import { ComponentProps, FC, useEffect, useImperativeHandle, useRef } from "react"

import { MediaMTXWebRTCReader } from "@/components/rtspPlayer/reader"

export interface RtspPlayerProps extends Omit<ComponentProps<"video">, "src" | "children"> {
    src: string
    user?: string
    pass?: string
    token?: string
    onReaderError?: (error: string) => void
}

function getWhepUrl(src: string) {
    const url = new URL(src, window.location.href)

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("RtspPlayer expects a MediaMTX HTTP(S) playback URL, not an RTSP URL")
    }

    const pathname = url.pathname.replace(/\/+$/, "")
    url.pathname = pathname.endsWith("/whep") ? pathname : `${pathname}/whep`
    url.hash = ""

    return url.toString()
}

function stopStream(stream: MediaStream) {
    stream.getTracks().forEach(track => track.stop())
}

export const RtspPlayer: FC<RtspPlayerProps> = ({ ref, src, user, pass, token, onReaderError, ...rest }) => {
    const video = useRef<HTMLVideoElement>(null)
    const onReaderErrorRef = useRef(onReaderError)

    useImperativeHandle(ref, () => video.current!, [])

    useEffect(() => {
        onReaderErrorRef.current = onReaderError
    }, [onReaderError])

    useEffect(() => {
        const { current: player } = video
        if (!player || !src) return

        if (typeof RTCPeerConnection === "undefined" || typeof MediaStream === "undefined") {
            onReaderErrorRef.current?.("RtspPlayer requires WebRTC support in the current browser")
            return
        }

        let whepUrl: string

        try {
            whepUrl = getWhepUrl(src)
        } catch (error) {
            onReaderErrorRef.current?.(error instanceof Error ? error.message : String(error))
            return
        }

        let closed = false
        const fallbackStream = new MediaStream()
        const reader = new MediaMTXWebRTCReader({
            url: whepUrl,
            user,
            pass,
            token,
            onError: error => onReaderErrorRef.current?.(error),
            onTrack: evt => {
                if (closed) return

                const stream = evt.streams[0] ?? fallbackStream

                if (evt.streams.length === 0 && !fallbackStream.getTracks().includes(evt.track)) fallbackStream.addTrack(evt.track)
                if (player.srcObject !== stream) player.srcObject = stream
            },
        })

        return () => {
            closed = true
            reader.close()

            const { srcObject } = player
            if (srcObject instanceof MediaStream) stopStream(srcObject)
            if (srcObject !== fallbackStream) stopStream(fallbackStream)

            player.srcObject = null
            player.load()
        }
    }, [src, user, pass, token])

    return <video ref={video} {...rest} />
}
