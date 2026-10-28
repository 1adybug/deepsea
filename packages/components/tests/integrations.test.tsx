import { createRef } from "react"

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import Hls, { ErrorTypes } from "hls.js"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AutoScroll } from "../src/components/AutoScroll"
import { CopyButton } from "../src/components/CopyButton"
import * as charts from "../src/components/Echart"
import { HlsPlayer } from "../src/components/HlsPlayer"
import { getFileData, InputFile } from "../src/components/InputFile"
import { InputFileButton } from "../src/components/InputFileButton"
import { ReadExcel } from "../src/components/ReadExcel"
import { ReadSheet } from "../src/components/ReadSheet"
import { type Scrollbar, Scroll } from "../src/components/Scroll"
import { WriteExcel } from "../src/components/WriteExcel"
import { WriteSheet } from "../src/components/WriteSheet"

import { RtspPlayer } from "../src/components/RtspPlayer"

const mocks = vi.hoisted(() => ({
    clipboard: { on: vi.fn(), destroy: vi.fn() },
    bar: { addListener: vi.fn(), removeListener: vi.fn(), destroy: vi.fn(), scrollTo: vi.fn() },
    chart: { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() },
    hls: { loadSource: vi.fn(), attachMedia: vi.fn(), on: vi.fn(), startLoad: vi.fn(), recoverMediaError: vi.fn(), destroy: vi.fn() },
    reader: { close: vi.fn() },
    readerOptions: undefined as any,
    writeSheet: vi.fn(),
    readSheet: vi.fn(() => ({ Data: [{ id: 1 }] })),
}))

vi.mock("clipboard", () => ({
    default: class {
        on = mocks.clipboard.on
        destroy = mocks.clipboard.destroy
    },
}))

vi.mock("smooth-scrollbar", () => ({ default: { init: vi.fn(() => mocks.bar) } }))
vi.mock("echarts", async importOriginal => ({ ...(await importOriginal<object>()), init: vi.fn(() => mocks.chart) }))

vi.mock("hls.js", () => ({
    default: class {
        static isSupported = vi.fn(() => true)
        static Events = { ERROR: "error" }
        loadSource = mocks.hls.loadSource
        attachMedia = mocks.hls.attachMedia
        on = mocks.hls.on
        startLoad = mocks.hls.startLoad
        recoverMediaError = mocks.hls.recoverMediaError
        destroy = mocks.hls.destroy
    },
    ErrorTypes: { NETWORK_ERROR: "networkError", MEDIA_ERROR: "mediaError" },
}))

vi.mock("../src/components/rtspPlayer/reader", () => ({
    MediaMTXWebRTCReader: class {
        constructor(options: unknown) {
            mocks.readerOptions = options
        }

        close = mocks.reader.close
    },
}))

vi.mock("@1adybug/tools", async importOriginal => ({ ...(await importOriginal<object>()), writeSheet: mocks.writeSheet, readSheet: mocks.readSheet }))

afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
    vi.useRealTimers()
})

describe("file interactions", () => {
    it("reads binary and array buffer modes and ignores empty selections", async () => {
        const file = new File([new Uint8Array([0, 65, 255])], "binary.dat")
        expect(new Uint8Array(await getFileData(file, "arrayBuffer"))).toEqual(new Uint8Array([0, 65, 255]))
        expect(await getFileData(file, "binary")).toBe("\0Aÿ")
        const changed = vi.fn()
        const { container } = render(<InputFile onValueChange={changed} />)
        fireEvent.change(container.querySelector("input")!, { target: { files: [] } })
        expect(changed).not.toHaveBeenCalled()
    })

    it.each(["error", "abort"])("rejects FileReader %s events", async event => {
        vi.stubGlobal(
            "FileReader",
            class extends EventTarget {
                error = null

                readAsText() {
                    this.dispatchEvent(new Event(event))
                }
            },
        )

        await expect(getFileData(new File([], "x"), "text")).rejects.toThrow()
    })

    it("reports file/value pairs and forwards external disabled state", async () => {
        const onDataChange = vi.fn()
        const file = new File(["data"], "file.txt")
        const { container, rerender } = render(<InputFile type="text" onDataChange={onDataChange} clearAfterChange />)
        const input = container.querySelector("input")!
        fireEvent.change(input, { target: { files: [file] } })
        await waitFor(() => expect(onDataChange).toHaveBeenCalledWith({ file, value: "data" }))
        expect(input.value).toBe("")
        rerender(<InputFile disabled />)
        expect(input.disabled).toBe(true)
    })

    it("opens the hidden input unless prevented and accepts ordered file drops", async () => {
        const onValueChange = vi.fn()
        const ref = createRef<HTMLInputElement>()

        const view = render(
            <InputFileButton type="text" dragFile multiple inputProps={{ ref }} onValueChange={onValueChange}>
                Choose
            </InputFileButton>,
        )

        const click = vi.spyOn(ref.current!, "click").mockImplementation(() => {})
        fireEvent.click(screen.getByRole("button"))
        expect(click).toHaveBeenCalledTimes(1)

        const files = [new File(["one"], "one"), new File(["two"], "two")]

        fireEvent.drop(screen.getByRole("button"), { dataTransfer: { files } })
        await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(["one", "two"]))
        view.rerender(<InputFileButton onClick={event => event.preventDefault()}>Choose</InputFileButton>)
        fireEvent.click(screen.getByRole("button"))
        expect(click).toHaveBeenCalledTimes(1)
    })

    it("adapts spreadsheet input/output and preserves alias identity", async () => {
        const changed = vi.fn()
        const view = render(<ReadSheet onValueChange={changed} aria-label="sheet" />)
        fireEvent.change(screen.getByLabelText("sheet"), { target: { files: [new File(["bytes"], "data.xlsx")] } })
        await waitFor(() => expect(changed).toHaveBeenCalledWith({ Data: [{ id: 1 }] }))
        expect(mocks.readSheet).toHaveBeenCalledWith(expect.any(ArrayBuffer))

        const excel = { path: "data.xlsx", data: [{ id: 1 }] }

        view.rerender(<WriteSheet excel={excel}>Export</WriteSheet>)
        fireEvent.click(screen.getByRole("button"))
        expect(mocks.writeSheet).toHaveBeenCalledWith(excel)
        expect(ReadExcel).toBe(ReadSheet)
        expect(WriteExcel).toBe(WriteSheet)
    })
})

describe("third-party lifecycle integration", () => {
    it("uses current clipboard callbacks and destroys the instance", () => {
        const first = vi.fn(),
            second = vi.fn()

        const view = render(<CopyButton text="a" onCopySuccess={first} />)
        const success = mocks.clipboard.on.mock.calls.find(call => call[0] === "success")![1]
        success({ text: "a" })
        view.rerender(<CopyButton text="b" onCopySuccess={second} />)
        success({ text: "b" })
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledWith({ text: "b" })
        expect(screen.getByRole("button").getAttribute("data-clipboard-text")).toBe("b")
        view.unmount()
        expect(mocks.clipboard.destroy).toHaveBeenCalledTimes(1)
    })

    it("exposes Scroll refs, forwards listener updates and destroys the scrollbar", () => {
        const ref = createRef<HTMLDivElement>(),
            scrollbar = createRef<Scrollbar>()

        const callback = vi.fn()

        const view = render(
            <Scroll ref={ref} scrollbar={scrollbar} onScrollbar={callback} options={{ thumbWidth: 8 }}>
                Content
            </Scroll>,
        )

        expect(ref.current?.textContent).toBe("Content")
        expect(scrollbar.current).toBe(mocks.bar)
        const listener = mocks.bar.addListener.mock.calls[0][0]
        listener({ offset: { x: 0, y: 1 } })
        expect(callback).toHaveBeenCalledTimes(1)
        view.unmount()
        expect(mocks.bar.removeListener).toHaveBeenCalledWith(listener)
        expect(mocks.bar.destroy).toHaveBeenCalledTimes(1)
    })

    it("schedules AutoScroll, pauses on hover and cancels timers on unmount", () => {
        vi.useFakeTimers()
        let resize!: ResizeObserverCallback

        vi.stubGlobal(
            "ResizeObserver",
            class {
                constructor(cb: ResizeObserverCallback) {
                    resize = cb
                }

                observe() {}
                disconnect() {}
            },
        )

        const { container, unmount } = render(
            <AutoScroll count={3} itemSize={50} duration={100} animation={20}>
                Content
            </AutoScroll>,
        )

        act(() => resize([{ borderBoxSize: [{ inlineSize: 100, blockSize: 50 }] } as never], {} as ResizeObserver))
        fireEvent.mouseEnter(container.firstElementChild!)
        act(() => vi.advanceTimersByTime(100))
        expect(mocks.bar.scrollTo).not.toHaveBeenCalled()
        fireEvent.mouseLeave(container.firstElementChild!)
        act(() => vi.advanceTimersByTime(100))
        expect(mocks.bar.scrollTo).toHaveBeenCalledWith(0, 50, 20)
        unmount()
        expect(vi.getTimerCount()).toBe(0)
    })

    it("updates chart options, resizes and disposes the chart instance", () => {
        const Component = charts.Echart
        const chart = createRef<any>()
        const view = render(<Component option={{}} width={100} height={50} chart={chart} />)
        expect(chart.current).toBe(mocks.chart)
        view.rerender(<Component option={{ animation: false }} width={200} height={80} chart={chart} />)
        expect(mocks.chart.setOption).toHaveBeenCalledWith({ animation: false })
        expect(mocks.chart.resize).toHaveBeenLastCalledWith({ width: 200, height: 80 })
        view.unmount()
        expect(mocks.chart.dispose).toHaveBeenCalledTimes(1)
    })

    it("keeps every typed chart variant on the shared lifecycle implementation", () => {
        for (const Component of Object.values(charts)) expect(Component).toBe(charts.Echart)
    })

    it("loads HLS, retries each fatal recovery once and destroys failed instances", () => {
        vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {})
        const onHlsError = vi.fn()
        const view = render(<HlsPlayer src=" stream.m3u8 " onHlsError={onHlsError} />)
        expect(mocks.hls.loadSource).toHaveBeenCalledWith("stream.m3u8")
        const error = mocks.hls.on.mock.calls[0][1]
        error("error", { fatal: true, type: ErrorTypes.NETWORK_ERROR })
        error("error", { fatal: true, type: ErrorTypes.MEDIA_ERROR })
        expect(mocks.hls.startLoad).toHaveBeenCalledTimes(1)
        expect(mocks.hls.recoverMediaError).toHaveBeenCalledTimes(1)
        error("error", { fatal: true, type: ErrorTypes.NETWORK_ERROR })
        expect(mocks.hls.destroy).toHaveBeenCalledTimes(1)
        expect(onHlsError).toHaveBeenCalledTimes(3)
        view.unmount()
        expect(mocks.hls.destroy).toHaveBeenCalledTimes(1)
    })

    it("reports unsupported HLS when neither engine nor native playback is available", () => {
        vi.mocked(Hls.isSupported).mockReturnValueOnce(false)
        vi.spyOn(HTMLMediaElement.prototype, "canPlayType").mockReturnValue("")
        vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {})
        const unsupported = vi.fn()
        render(<HlsPlayer src="stream.m3u8" onHlsUnsupported={unsupported} />)
        expect(unsupported).toHaveBeenCalledTimes(1)
    })

    it("validates MediaMTX playback URLs and releases tracks on unmount", () => {
        const stopped = vi.fn()
        vi.stubGlobal("RTCPeerConnection", class {})

        vi.stubGlobal(
            "MediaStream",
            class {
                tracks: unknown[] = []

                getTracks() {
                    return this.tracks
                }

                addTrack(track: unknown) {
                    this.tracks.push(track)
                }
            },
        )

        vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {})
        const ref = createRef<HTMLVideoElement>()
        const error = vi.fn()
        const view = render(<RtspPlayer ref={ref} src="https://media.test/camera/#hash" onReaderError={error} />)
        expect(mocks.readerOptions.url).toBe("https://media.test/camera/whep")
        mocks.readerOptions.onTrack({ streams: [], track: { stop: stopped } })
        expect(ref.current?.srcObject).toBeInstanceOf(MediaStream)
        view.unmount()
        expect(mocks.reader.close).toHaveBeenCalledTimes(1)
        expect(stopped).toHaveBeenCalledTimes(1)
        render(<RtspPlayer src="rtsp://camera.test/live" onReaderError={error} />)
        expect(error).toHaveBeenCalledWith(expect.stringContaining("HTTP(S)"))
    })
})
