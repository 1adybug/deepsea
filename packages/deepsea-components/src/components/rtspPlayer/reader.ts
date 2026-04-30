/*
 * Derived from MediaMTX reader.js:
 * https://github.com/bluenviron/mediamtx/blob/main/internal/servers/webrtc/reader.js
 *
 * MIT License
 *
 * Copyright (c) 2019 aler9
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export interface MediaMTXWebRTCReaderConf {
    url: string
    user?: string
    pass?: string
    token?: string
    onError?: (err: string) => void
    onTrack?: (evt: RTCTrackEvent) => void
    onDataChannel?: (evt: RTCDataChannelEvent) => void
}

interface OfferData {
    iceUfrag: string
    icePwd: string
    medias: string[]
}

type RTCIceServerWithCredentialType = RTCIceServer & {
    credentialType?: "password"
}

type ReaderState = "getting_codecs" | "running" | "restarting" | "failed" | "closed"

export class MediaMTXWebRTCReader {
    private readonly retryPause = 2000
    private readonly conf: MediaMTXWebRTCReaderConf
    private state: ReaderState = "getting_codecs"
    private restartTimeout: number | null = null
    private pc: RTCPeerConnection | null = null
    private offerData: OfferData | null = null
    private sessionUrl: string | null = null
    private queuedCandidates: RTCIceCandidate[] = []
    private nonAdvertisedCodecs: string[] = []

    constructor(conf: MediaMTXWebRTCReaderConf) {
        this.conf = conf
        this.getNonAdvertisedCodecs()
    }

    close() {
        this.state = "closed"

        if (this.pc) {
            this.pc.close()
            this.pc = null
        }

        if (this.restartTimeout !== null) {
            clearTimeout(this.restartTimeout)
            this.restartTimeout = null
        }
    }

    private static supportsNonAdvertisedCodec(codec: string, fmtp?: string) {
        return new Promise<boolean>(resolve => {
            const pc = new RTCPeerConnection({ iceServers: [] })
            const mediaType = "audio"
            let payloadType = ""

            pc.addTransceiver(mediaType, { direction: "recvonly" })
            pc.createOffer()
                .then(offer => {
                    if (offer.sdp === undefined) throw new Error("SDP not present")
                    if (offer.sdp.includes(` ${codec}`)) throw new Error("already present")

                    const sections = offer.sdp.split(`m=${mediaType}`)
                    const payloadTypes = sections
                        .slice(1)
                        .map(section => section.split("\r\n")[0].split(" ").slice(3))
                        .reduce<string[]>((prev, cur) => [...prev, ...cur], [])

                    payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)

                    const lines = sections[1].split("\r\n")
                    lines[0] += ` ${payloadType}`
                    lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} ${codec}`)
                    if (fmtp !== undefined) lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} ${fmtp}`)

                    sections[1] = lines.join("\r\n")
                    offer.sdp = sections.join(`m=${mediaType}`)

                    return pc.setLocalDescription(offer)
                })
                .then(() =>
                    pc.setRemoteDescription(
                        new RTCSessionDescription({
                            type: "answer",
                            sdp:
                                "v=0\r\n" +
                                "o=- 6539324223450680508 0 IN IP4 0.0.0.0\r\n" +
                                "s=-\r\n" +
                                "t=0 0\r\n" +
                                "a=fingerprint:sha-256 0D:9F:78:15:42:B5:4B:E6:E2:94:3E:5B:37:78:E1:4B:54:59:A3:36:3A:E5:05:EB:27:EE:8F:D2:2D:41:29:25\r\n" +
                                `m=${mediaType} 9 UDP/TLS/RTP/SAVPF ${payloadType}\r\n` +
                                "c=IN IP4 0.0.0.0\r\n" +
                                "a=ice-pwd:7c3bf4770007e7432ee4ea4d697db675\r\n" +
                                "a=ice-ufrag:29e036dc\r\n" +
                                "a=sendonly\r\n" +
                                "a=rtcp-mux\r\n" +
                                `a=rtpmap:${payloadType} ${codec}\r\n` +
                                (fmtp !== undefined ? `a=fmtp:${payloadType} ${fmtp}\r\n` : ""),
                        }),
                    ),
                )
                .then(() => resolve(true))
                .catch(() => resolve(false))
                .finally(() => pc.close())
        })
    }

    private static unquoteCredential(value: string) {
        return JSON.parse(`"${value}"`) as string
    }

    private static linkToIceServers(links: string | null) {
        if (links === null) return []

        return links
            .split(", ")
            .map(link => {
                const match = link.match(/^<(.+?)>; rel="ice-server"(; username="(.*?)"; credential="(.*?)"; credential-type="password")?/i)
                if (!match) return null

                const ret: RTCIceServerWithCredentialType = { urls: [match[1]] }

                if (match[3] !== undefined && match[4] !== undefined) {
                    ret.username = MediaMTXWebRTCReader.unquoteCredential(match[3])
                    ret.credential = MediaMTXWebRTCReader.unquoteCredential(match[4])
                    ret.credentialType = "password"
                }

                return ret
            })
            .filter((server): server is RTCIceServer => server !== null)
    }

    private static parseOffer(sdp: string) {
        const ret: OfferData = {
            iceUfrag: "",
            icePwd: "",
            medias: [],
        }

        for (const line of sdp.split("\r\n")) {
            if (line.startsWith("m=")) ret.medias.push(line.slice("m=".length))
            else if (ret.iceUfrag === "" && line.startsWith("a=ice-ufrag:")) ret.iceUfrag = line.slice("a=ice-ufrag:".length)
            else if (ret.icePwd === "" && line.startsWith("a=ice-pwd:")) ret.icePwd = line.slice("a=ice-pwd:".length)
        }

        return ret
    }

    private static reservePayloadType(payloadTypes: string[]) {
        // Everything is valid between 30 and 127, except the interval between 64 and 95.
        // https://chromium.googlesource.com/external/webrtc/+/refs/heads/master/call/payload_type.h#29
        for (let i = 30; i <= 127; i++) {
            if ((i <= 63 || i >= 96) && !payloadTypes.includes(i.toString())) {
                const payloadType = i.toString()
                payloadTypes.push(payloadType)
                return payloadType
            }
        }

        throw new Error("unable to find a free payload type")
    }

    private static enableStereoPcmau(payloadTypes: string[], section: string) {
        const lines = section.split("\r\n")

        let payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} PCMU/8000/2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} PCMA/8000/2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        return lines.join("\r\n")
    }

    private static enableMultichannelOpus(payloadTypes: string[], section: string) {
        const lines = section.split("\r\n")

        let payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} multiopus/48000/3`)
        lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} channel_mapping=0,2,1;num_streams=2;coupled_streams=1`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} multiopus/48000/4`)
        lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} channel_mapping=0,1,2,3;num_streams=2;coupled_streams=2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} multiopus/48000/5`)
        lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} channel_mapping=0,4,1,2,3;num_streams=3;coupled_streams=2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} multiopus/48000/6`)
        lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} channel_mapping=0,4,1,2,3,5;num_streams=4;coupled_streams=2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} multiopus/48000/7`)
        lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} channel_mapping=0,4,1,2,3,5,6;num_streams=4;coupled_streams=4`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} multiopus/48000/8`)
        lines.splice(lines.length - 1, 0, `a=fmtp:${payloadType} channel_mapping=0,6,1,4,5,2,3,7;num_streams=5;coupled_streams=4`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        return lines.join("\r\n")
    }

    private static enableL16(payloadTypes: string[], section: string) {
        const lines = section.split("\r\n")

        let payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} L16/8000/2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} L16/16000/2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        payloadType = MediaMTXWebRTCReader.reservePayloadType(payloadTypes)
        lines[0] += ` ${payloadType}`
        lines.splice(lines.length - 1, 0, `a=rtpmap:${payloadType} L16/48000/2`)
        lines.splice(lines.length - 1, 0, `a=rtcp-fb:${payloadType} transport-cc`)

        return lines.join("\r\n")
    }

    private static enableStereoOpus(section: string) {
        let opusPayloadFormat = ""
        const lines = section.split("\r\n")

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("a=rtpmap:") && lines[i].toLowerCase().includes("opus/")) {
                opusPayloadFormat = lines[i].slice("a=rtpmap:".length).split(" ")[0]
                break
            }
        }

        if (opusPayloadFormat === "") return section

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith(`a=fmtp:${opusPayloadFormat} `)) {
                if (!lines[i].includes("stereo")) lines[i] += ";stereo=1"
                if (!lines[i].includes("sprop-stereo")) lines[i] += ";sprop-stereo=1"
            }
        }

        return lines.join("\r\n")
    }

    private static editOffer(sdp: string, nonAdvertisedCodecs: string[]) {
        const sections = sdp.split("m=")
        const payloadTypes = sections
            .slice(1)
            .map(section => section.split("\r\n")[0].split(" ").slice(3))
            .reduce<string[]>((prev, cur) => [...prev, ...cur], [])

        for (let i = 1; i < sections.length; i++) {
            if (sections[i].startsWith("audio")) {
                sections[i] = MediaMTXWebRTCReader.enableStereoOpus(sections[i])

                if (nonAdvertisedCodecs.includes("pcma/8000/2")) sections[i] = MediaMTXWebRTCReader.enableStereoPcmau(payloadTypes, sections[i])
                if (nonAdvertisedCodecs.includes("multiopus/48000/6")) sections[i] = MediaMTXWebRTCReader.enableMultichannelOpus(payloadTypes, sections[i])
                if (nonAdvertisedCodecs.includes("L16/48000/2")) sections[i] = MediaMTXWebRTCReader.enableL16(payloadTypes, sections[i])

                break
            }
        }

        return sections.join("m=")
    }

    private static generateSdpFragment(offerData: OfferData, candidates: RTCIceCandidate[]) {
        const candidatesByMedia: Record<number, RTCIceCandidate[]> = {}

        for (const candidate of candidates) {
            const mid = candidate.sdpMLineIndex
            if (mid === null) continue

            candidatesByMedia[mid] ??= []
            candidatesByMedia[mid].push(candidate)
        }

        let frag = `a=ice-ufrag:${offerData.iceUfrag}\r\n` + `a=ice-pwd:${offerData.icePwd}\r\n`

        for (let mid = 0; mid < offerData.medias.length; mid++) {
            const mediaCandidates = candidatesByMedia[mid]
            if (mediaCandidates === undefined) continue

            frag += `m=${offerData.medias[mid]}\r\n` + `a=mid:${mid}\r\n`

            for (const candidate of mediaCandidates) frag += `a=${candidate.candidate}\r\n`
        }

        return frag
    }

    private handleError(err: string) {
        if (this.state === "running") {
            if (this.pc) {
                this.pc.close()
                this.pc = null
            }

            this.offerData = null

            if (this.sessionUrl !== null) {
                fetch(this.sessionUrl, { method: "DELETE" })
                this.sessionUrl = null
            }

            this.queuedCandidates = []
            this.state = "restarting"

            this.restartTimeout = window.setTimeout(() => {
                this.restartTimeout = null
                this.state = "running"
                this.start()
            }, this.retryPause)

            this.conf.onError?.(`${err}, retrying in some seconds`)
        } else if (this.state === "getting_codecs") {
            this.state = "failed"
            this.conf.onError?.(err)
        }
    }

    private getNonAdvertisedCodecs() {
        Promise.all(
            [
                ["pcma/8000/2"],
                ["multiopus/48000/6", "channel_mapping=0,4,1,2,3,5;num_streams=4;coupled_streams=2"],
                ["L16/48000/2"],
            ].map(codec =>
                MediaMTXWebRTCReader.supportsNonAdvertisedCodec(codec[0], codec[1]).then(isSupported => {
                    if (!isSupported) return false
                    return codec[0]
                }),
            ),
        )
            .then(codecs => codecs.filter((codec): codec is string => codec !== false))
            .then(codecs => {
                if (this.state !== "getting_codecs") throw new Error("closed")

                this.nonAdvertisedCodecs = codecs
                this.state = "running"
                this.start()
            })
            .catch(err => this.handleError(String(err)))
    }

    private start() {
        this.requestICEServers()
            .then(iceServers => this.setupPeerConnection(iceServers))
            .then(offer => this.sendOffer(offer))
            .then(answer => this.setAnswer(answer))
            .catch(err => this.handleError(String(err)))
    }

    private authHeader(): Record<string, string> {
        if (this.conf.user !== undefined && this.conf.user !== "") {
            const credentials = btoa(`${this.conf.user}:${this.conf.pass ?? ""}`)
            return { Authorization: `Basic ${credentials}` }
        }

        if (this.conf.token !== undefined && this.conf.token !== "") return { Authorization: `Bearer ${this.conf.token}` }

        return {}
    }

    private requestICEServers() {
        return fetch(this.conf.url, {
            method: "OPTIONS",
            headers: {
                ...this.authHeader(),
            },
        }).then(res => MediaMTXWebRTCReader.linkToIceServers(res.headers.get("Link")))
    }

    private setupPeerConnection(iceServers: RTCIceServer[]) {
        if (this.state !== "running") throw new Error("closed")

        const pc = new RTCPeerConnection({
            iceServers,
            sdpSemantics: "unified-plan",
        } as RTCConfiguration)

        this.pc = pc

        const direction = "recvonly"
        pc.addTransceiver("video", { direction })
        pc.addTransceiver("audio", { direction })
        pc.createDataChannel("")

        pc.onicecandidate = evt => this.onLocalCandidate(evt)
        pc.onconnectionstatechange = () => this.onConnectionState()
        pc.ontrack = evt => this.onTrack(evt)
        pc.ondatachannel = evt => this.onDataChannel(evt)

        return pc.createOffer().then(offer => {
            if (offer.sdp === undefined) throw new Error("SDP not present")

            offer.sdp = MediaMTXWebRTCReader.editOffer(offer.sdp, this.nonAdvertisedCodecs)
            this.offerData = MediaMTXWebRTCReader.parseOffer(offer.sdp)

            return pc.setLocalDescription(offer).then(() => offer.sdp!)
        })
    }

    private sendOffer(offer: string) {
        if (this.state !== "running") throw new Error("closed")

        return fetch(this.conf.url, {
            method: "POST",
            headers: {
                ...this.authHeader(),
                "Content-Type": "application/sdp",
            },
            body: offer,
        }).then(res => {
            switch (res.status) {
                case 201:
                    break
                case 404:
                    throw new Error("stream not found")
                case 400:
                    return res.json().then((body: { error?: string }) => {
                        throw new Error(body.error ?? "bad request")
                    })
                default:
                    throw new Error(`bad status code ${res.status}`)
            }

            const location = res.headers.get("location")
            if (location === null) throw new Error("session location not present")

            this.sessionUrl = new URL(location, this.conf.url).toString()

            return res.text()
        })
    }

    private setAnswer(answer: string) {
        if (this.state !== "running") throw new Error("closed")
        if (!this.pc) throw new Error("peer connection not present")

        return this.pc
            .setRemoteDescription(
                new RTCSessionDescription({
                    type: "answer",
                    sdp: answer,
                }),
            )
            .then(() => {
                if (this.state !== "running") return

                if (this.queuedCandidates.length !== 0) {
                    this.sendLocalCandidates(this.queuedCandidates)
                    this.queuedCandidates = []
                }
            })
    }

    private onLocalCandidate(evt: RTCPeerConnectionIceEvent) {
        if (this.state !== "running") return

        if (evt.candidate !== null) {
            if (this.sessionUrl === null) this.queuedCandidates.push(evt.candidate)
            else this.sendLocalCandidates([evt.candidate])
        }
    }

    private sendLocalCandidates(candidates: RTCIceCandidate[]) {
        if (this.sessionUrl === null || this.offerData === null) return

        fetch(this.sessionUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/trickle-ice-sdpfrag",
                "If-Match": "*",
            },
            body: MediaMTXWebRTCReader.generateSdpFragment(this.offerData, candidates),
        })
            .then(res => {
                switch (res.status) {
                    case 204:
                        break
                    case 404:
                        throw new Error("stream not found")
                    default:
                        throw new Error(`bad status code ${res.status}`)
                }
            })
            .catch(err => this.handleError(String(err)))
    }

    private onConnectionState() {
        if (this.state !== "running" || !this.pc) return

        if (this.pc.connectionState === "failed" || this.pc.connectionState === "closed") this.handleError("peer connection closed")
    }

    private onTrack(evt: RTCTrackEvent) {
        this.conf.onTrack?.(evt)
    }

    private onDataChannel(evt: RTCDataChannelEvent) {
        this.conf.onDataChannel?.(evt)
    }
}
