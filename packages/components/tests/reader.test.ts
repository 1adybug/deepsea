import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { MediaMTXWebRTCReader } from "../src/components/rtspPlayer/reader"

const sdp =
    "v=0\r\na=ice-ufrag:test\r\na=ice-pwd:password\r\nm=audio 9 UDP/TLS/RTP/SAVPF 0 96 97 98 111\r\na=mid:0\r\na=rtpmap:96 pcma/8000/2\r\na=rtpmap:97 multiopus/48000/6\r\na=rtpmap:98 L16/48000/2\r\na=rtpmap:111 opus/48000/2\r\na=fmtp:111 minptime=10\r\nm=video 9 UDP/TLS/RTP/SAVPF 100\r\na=mid:1\r\n"

const peers: FakePeer[] = []

class FakePeer {
    onicecandidate: Function | null = null
    onconnectionstatechange: Function | null = null
    ontrack: Function | null = null
    ondatachannel: Function | null = null
    connectionState = "new"
    addTransceiver = vi.fn()
    createDataChannel = vi.fn()
    createOffer = vi.fn(async () => ({ type: "offer", sdp }))
    setLocalDescription = vi.fn(async () => {})
    setRemoteDescription = vi.fn(async () => {})
    close = vi.fn()

    constructor(public config: RTCConfiguration) {
        peers.push(this)
    }
}

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
    peers.length = 0
    vi.stubGlobal("RTCPeerConnection", FakePeer)

    vi.stubGlobal(
        "RTCSessionDescription",
        class {
            constructor(init: RTCSessionDescriptionInit) {
                Object.assign(this, init)
            }
        },
    )

    fetchMock = vi.fn(async (_url: string, options: RequestInit) => {
        if (options.method === "OPTIONS") return { headers: new Headers({ Link: '<stun:stun.test>; rel="ice-server"' }) }
        if (options.method === "POST") return { status: 201, headers: new Headers({ location: "/session/1" }), text: async () => sdp }
        return { status: 204 }
    })
    vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
})

describe("WHEP reader negotiation", () => {
    it("negotiates a session, forwards tracks/data and releases peer and remote session", async () => {
        const onTrack = vi.fn(),
            onDataChannel = vi.fn()

        const reader = new MediaMTXWebRTCReader({ url: "https://media.test/live/whep", user: "test", pass: "fixture", onTrack, onDataChannel })
        await vi.waitFor(() => expect(peers.at(-1)?.setRemoteDescription).toHaveBeenCalledTimes(1))
        const peer = peers.at(-1)!
        expect(peer.config.iceServers).toEqual([{ urls: ["stun:stun.test"] }])

        expect(fetchMock.mock.calls.find(call => call[1].method === "POST")![1]).toMatchObject({
            headers: { Authorization: "Basic dGVzdDpmaXh0dXJl", "Content-Type": "application/sdp" },
        })

        const track = { track: {} },
            channel = { channel: {} }

        peer.ontrack!(track)
        peer.ondatachannel!(channel)
        expect(onTrack).toHaveBeenCalledWith(track)
        expect(onDataChannel).toHaveBeenCalledWith(channel)
        peer.onicecandidate!({ candidate: { candidate: "candidate:1", sdpMLineIndex: 0 } })
        await vi.waitFor(() => expect(fetchMock.mock.calls.some(call => call[1].method === "PATCH")).toBe(true))
        expect(fetchMock.mock.calls.find(call => call[1].method === "PATCH")![1].body).toContain("a=candidate:1")
        reader.close()
        reader.close()
        expect(peer.close).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls.filter(call => call[1].method === "DELETE")).toHaveLength(1)
    })

    it("reports missing streams, schedules a bounded retry and cancels it on close", async () => {
        vi.useFakeTimers()
        fetchMock.mockImplementation(async (_url: string, options: RequestInit) =>
            options.method === "OPTIONS" ? { headers: new Headers() } : { status: 404 },
        )
        const onError = vi.fn()
        const reader = new MediaMTXWebRTCReader({ url: "https://media.test/live/whep", token: "fixture-token", onError })
        await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(expect.stringContaining("stream not found")))
        expect(fetchMock.mock.calls[0][1].headers).toEqual({ Authorization: "Bearer fixture-token" })
        const requests = fetchMock.mock.calls.length
        reader.close()
        await vi.advanceTimersByTimeAsync(3000)
        expect(fetchMock).toHaveBeenCalledTimes(requests)
        expect(vi.getTimerCount()).toBe(0)
    })

    it("does not start a connection when closed during codec detection", async () => {
        const reader = new MediaMTXWebRTCReader({ url: "https://media.test/live/whep" })
        reader.close()
        await Promise.all(peers.map(peer => peer.createOffer.mock.results[0].value))
        for (let index = 0; index < 10; index++) await Promise.resolve()
        expect(fetchMock).not.toHaveBeenCalled()
        expect(peers.every(peer => peer.close.mock.calls.length === 1)).toBe(true)
    })

    it("releases a session allocated after the caller already closed the reader", async () => {
        let finish!: (response: unknown) => void

        fetchMock.mockImplementation(async (_url: string, options: RequestInit) => {
            if (options.method === "OPTIONS") return { headers: new Headers() }

            if (options.method === "POST") {
                return new Promise(resolve => {
                    finish = resolve
                })
            }

            return { status: 204 }
        })

        const reader = new MediaMTXWebRTCReader({ url: "https://media.test/live/whep" })
        await vi.waitFor(() => expect(finish).toBeTypeOf("function"))
        reader.close()
        finish({ status: 201, headers: new Headers({ location: "/session/late" }), text: async () => sdp })
        await vi.waitFor(() =>
            expect(fetchMock.mock.calls.some(call => call[0] === "https://media.test/session/late" && call[1].method === "DELETE")).toBe(true),
        )
        expect(peers.at(-1)?.setRemoteDescription).not.toHaveBeenCalled()
    })
})
