import { createRef } from "react"

import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { AutoFit } from "../src/components/AutoFit"
import { AutoSizeTextArea } from "../src/components/AutoSizeTextarea"
import { CircleText } from "../src/components/CircleText"
import { DraggableGrid } from "../src/components/DraggableGrid"
import { Flow, getGapCountAndSize, getGapRange, ManualFlow } from "../src/components/Flow"
import { FormLabel, FormLabelConfigProvider } from "../src/components/FormLabel"
import { IconFileType, IconFileTypeBase, IconFileTypeDogEar, IconFileTypePage, IconFileTypeText } from "../src/components/IconFileType"
import { InfiniteScroll } from "../src/components/InfiniteScroll"
import { LoopSwiper } from "../src/components/LoopSwiper"
import { Ring } from "../src/components/Ring"
import { ScrollMask } from "../src/components/ScrollMask"
import { SectionRing } from "../src/components/SectionRing"
import { Skeleton } from "../src/components/Skeleton"
import { Title } from "../src/components/Title"
import { TransitionBox } from "../src/components/TransitionBox"
import { TransitionNum } from "../src/components/TransitionNum"
import { Trapezium } from "../src/components/Trapezium"
import { Unify, UnifyConfigProvider } from "../src/components/Unify"

import { getReactVersion } from "../src/utils/getReactVersion"
import { px, transformCSSVariable, transformCSSVariableName } from "../src/utils/index"

const observers: { callback: ResizeObserverCallback; targets: Set<Element>; disconnect: ReturnType<typeof vi.fn> }[] = []

function resize(target: Element, width: number, height: number) {
    act(() => {
        for (const observer of [...observers]) {
            if (observer.targets.has(target)) {
                observer.callback(
                    [
                        {
                            target,
                            contentRect: { width, height },
                            borderBoxSize: [{ inlineSize: width, blockSize: height }],
                            contentBoxSize: [{ inlineSize: width, blockSize: height }],
                        } as unknown as ResizeObserverEntry,
                    ],
                    {} as ResizeObserver,
                )
            }
        }
    })
}

beforeEach(() => {
    observers.length = 0

    vi.stubGlobal(
        "ResizeObserver",
        class {
            targets = new Set<Element>()
            disconnect = vi.fn(() => this.targets.clear())

            constructor(public callback: ResizeObserverCallback) {
                observers.push(this)
            }

            observe(target: Element) {
                this.targets.add(target)
            }
        },
    )
})

afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
})

describe("layout helpers and static components", () => {
    it("converts every uppercase CSS variable segment and preserves style overrides", () => {
        expect(transformCSSVariableName("borderTopLeftRadius")).toBe("--border-top-left-radius")
        expect(transformCSSVariable({ fontSize: 12 }, { color: "red" })).toEqual({ "--font-size": 12, color: "red" })
        expect([px(0), px("10%"), px(undefined)]).toEqual(["0px", "10%", undefined])
        expect(getReactVersion()[0]).toBe(19)
    })

    it("merges nested Unify defaults and lets component props override them", () => {
        render(
            <UnifyConfigProvider className="p-2" style={{ color: "red" }}>
                <UnifyConfigProvider className="p-4">
                    <Unify as="button" className="p-8" style={{ color: "blue" }}>
                        Action
                    </Unify>
                </UnifyConfigProvider>
            </UnifyConfigProvider>,
        )

        const button = screen.getByRole("button")
        expect(button.className).toBe("p-8")
        expect(button.style.color).toBe("blue")
    })

    it("uses label context defaults with explicit prop overrides", () => {
        const { container } = render(
            <FormLabelConfigProvider width={100} before>
                <FormLabel data-testid="label" width={80}>
                    Name
                </FormLabel>
            </FormLabelConfigProvider>,
        )

        expect(screen.getByTestId("label").style.width).toBe("80px")
        expect(container.children).toHaveLength(2)
    })

    it("renders and updates Skeleton contents and document titles", () => {
        const { rerender } = render(<Skeleton data-testid="skeleton" />)
        const loadingClass = screen.getByTestId("skeleton").className
        rerender(<Skeleton data-testid="skeleton">Ready</Skeleton>)
        expect(screen.getByTestId("skeleton").textContent).toBe("Ready")
        expect(screen.getByTestId("skeleton").className).not.toBe(loadingClass)
        const title = render(<Title>Deepsea tests</Title>)
        expect(document.title).toBe("Deepsea tests")
        title.rerender(<Title>Updated title</Title>)
        expect(document.title).toBe("Updated title")
    })

    it("renders ring, segmented ring and trapezium geometry with forwarded refs", () => {
        const ref = createRef<HTMLDivElement>()

        const { container } = render(
            <>
                <Ring ref={ref} outerWidth={100} innerWidth={60} />
                <SectionRing outerRadius={50} innerRadius={30} count={4} angel={1} />
                <Trapezium top={60} bottom={100} height={40} borderRadius={4} />
            </>,
        )

        expect(ref.current?.style.width).toBe("100px")
        expect(ref.current?.style.clipPath).toContain("a50,50")
        expect((container.children[1] as HTMLElement).style.clipPath.match(/ A /g)).toHaveLength(8)
        expect((container.children[2] as HTMLElement).style.getPropertyValue("--clip-path")).toContain("path(")
    })

    it("renders composite and individual SVG parts with caller colors and text", () => {
        const { container } = render(
            <>
                <IconFileType pageColor="blue" textColor="red">
                    PDF
                </IconFileType>
                <IconFileTypeBase>
                    <IconFileTypePage pageColor="green" />
                    <IconFileTypeDogEar pageWidth={100} />
                    <IconFileTypeText>TXT</IconFileTypeText>
                </IconFileTypeBase>
            </>,
        )

        expect(container.querySelectorAll("svg")).toHaveLength(2)
        expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe("-256 -256 512 512")
        expect(container.querySelector("path")?.getAttribute("fill")).toBe("blue")
        expect(screen.getByText("PDF").getAttribute("fill")).toBe("red")
        expect(screen.getByText("TXT")).not.toBeNull()
    })

    it("positions circular text and supports custom splitting and reversal", () => {
        const { container } = render(
            <CircleText width={10} height={20} radius={50} separator=" " reverse>
                A B C
            </CircleText>,
        )

        expect([...container.children].map(child => child.textContent)).toEqual(["C", "B", "A"])
        expect((container.firstElementChild as HTMLElement).style.transform).toContain("rotateZ(")
    })
})

describe("measurement and animation", () => {
    it.each(["horizontal", "vertical", "both"] as const)("scales AutoFit in %s mode and disconnects observers", direction => {
        const { container, unmount } = render(
            <div>
                <AutoFit width={100} height={50} direction={direction} data-testid="fit">
                    Content
                </AutoFit>
            </div>,
        )

        const parent = container.firstElementChild!
        expect(screen.queryByTestId("fit")).toBeNull()
        resize(parent, 200, 100)
        expect(screen.getByTestId("fit").style.getPropertyValue("--transform")).toContain("scale(2)")
        unmount()
        expect(observers.every(observer => observer.disconnect.mock.calls.length > 0)).toBe(true)
    })

    it("resizes textarea on input and removes DOM listeners", () => {
        const ref = createRef<HTMLTextAreaElement>()
        const { unmount } = render(<AutoSizeTextArea ref={ref} aria-label="notes" />)
        const textarea = screen.getByRole<HTMLTextAreaElement>("textbox")
        expect(ref.current).toBe(textarea)
        Object.defineProperty(textarea, "scrollHeight", { configurable: true, value: 75 })
        fireEvent.input(textarea)
        expect(textarea.style.getPropertyValue("--height")).toBe("75px")
        const remove = vi.spyOn(textarea, "removeEventListener")
        unmount()
        expect(remove.mock.calls.map(call => call[0])).toEqual(expect.arrayContaining(["input", "change"]))
    })

    it("computes flow gaps and clips rows while reporting overflow", () => {
        expect(getGapRange()).toEqual([0, "auto"])
        expect(getGapRange(5)).toEqual([5, 5])
        expect(getGapRange([2, 10])).toEqual([2, 10])
        expect(getGapCountAndSize(320, 100, 10, "auto")).toEqual({ count: 3, gap: 10 })
        expect(getGapCountAndSize(50, 100, 10, 20)).toEqual({ count: 1, gap: 0 })
        const onSizeChange = vi.fn()
        const { container } = render(
            <ManualFlow
                width={220}
                itemWidth={100}
                itemHeight={30}
                gap={10}
                maxRows={1}
                data={["a", "b", "c"]}
                render={item => item}
                onSizeChange={onSizeChange}
                throttle={0}
            />,
        )
        expect(onSizeChange).toHaveBeenLastCalledWith(expect.objectContaining({ columnCount: 2, rowCount: 1, overflow: true }))
        expect((container.firstElementChild as HTMLElement).style.getPropertyValue("--height")).toBe("30px")
        expect(screen.getByText("c").style.getPropertyValue("--display")).toBe("none")
    })

    it("waits for a measured width before rendering Flow data", () => {
        const { container } = render(<Flow itemWidth={100} itemHeight={20} data={["item"]} render={item => item} throttle={0} />)
        expect(screen.queryByText("item")).toBeNull()
        resize(container.firstElementChild!, 300, 100)
        expect(screen.getByText("item")).not.toBeNull()
    })

    it("enables the LoopSwiper mirror only for overflowing content and releases observation", () => {
        const { container, unmount } = render(
            <LoopSwiper period={1000} classNames={{ container: "primary", mirror: "mirror" }}>
                Text
            </LoopSwiper>,
        )

        const root = container.firstElementChild!
        resize(root, 100, 20)
        resize(container.querySelector(".primary")!, 200, 20)
        expect(getComputedStyle(container.querySelector(".mirror")!).display).toBe("flex")
        unmount()
        expect(observers[0].disconnect).toHaveBeenCalled()
    })

    it("duplicates overflowing InfiniteScroll contents and controls animation on hover", () => {
        const cancel = vi.fn(),
            pause = vi.fn(),
            play = vi.fn()

        const animate = vi.fn(() => ({ cancel, pause, play }))
        vi.stubGlobal("Animation", class {})

        const { container, unmount } = render(
            <InfiniteScroll duration={1000} containerClassName="content" pauseOnHover>
                Text
            </InfiniteScroll>,
        )

        const root = container.firstElementChild as HTMLElement
        root.firstElementChild!.animate = animate as never
        resize(root, 100, 50)
        resize(container.querySelector(".content")!, 100, 200)
        expect(container.querySelectorAll(".content")).toHaveLength(2)
        expect(animate).toHaveBeenCalledWith({ transform: ["translateY(0)", "translateY(-200px)"] }, { duration: 1000, iterations: Infinity })
        fireEvent.mouseEnter(root)
        fireEvent.mouseLeave(root)
        expect(pause).toHaveBeenCalled()
        expect(play).toHaveBeenCalled()
        unmount()
        expect(cancel).toHaveBeenCalled()
    })

    it.each(["top", "bottom", "left", "right"] as const)("sets ScrollMask geometry for %s", position => {
        const { container } = render(<ScrollMask position={position} size={12} showRadian />)
        const root = container.firstElementChild as HTMLElement
        resize(root.firstElementChild!, 100, 10)
        expect(root.style.getPropertyValue("--scroll-mask-size")).toBe("12px")
        expect(root.style.getPropertyValue("--scroll-mask-clip-path")).toContain("circle(")
    })

    it("updates TransitionBox dimensions from measured content", () => {
        const { container } = render(<TransitionBox time={200}>Child</TransitionBox>)
        const root = container.firstElementChild as HTMLElement
        resize(root.firstElementChild!, 100, 50)
        expect(root.style.width).toBe("100px")
        expect(root.style.height).toBe("50px")
        resize(root.firstElementChild!, 200, 60)
        expect(root.style.transitionDuration).toBe("200ms")
    })

    it("transitions integer values and rejects invalid targets or periods", () => {
        vi.useFakeTimers()
        const ins = createRef<{ get(): number }>()

        const view = render(
            <TransitionNum period={2} ins={ins}>
                {1}
            </TransitionNum>,
        )

        expect(ins.current?.get()).toBe(1)

        view.rerender(
            <TransitionNum period={2} ins={ins}>
                {5}
            </TransitionNum>,
        )

        act(() => vi.advanceTimersByTime(100))
        expect(ins.current?.get()).toBe(5)
        view.unmount()
        expect(vi.getTimerCount()).toBe(0)
        expect(() => render(<TransitionNum period={0}>{1}</TransitionNum>)).toThrow(RangeError)
    })

    it("renders grid items, validates duplicate keys and handles controlled ordering", () => {
        const props = { columns: 2, rows: 1, itemWidth: 100, itemHeight: 50, render: (item: string) => item }

        const onOrderMapChange = vi.fn()
        const view = render(<DraggableGrid {...props} items={["a", "b"]} onOrderMapChange={onOrderMapChange} />)
        expect(screen.getByText("a")).not.toBeNull()

        expect(onOrderMapChange.mock.calls[0][0]).toEqual(
            new Map([
                ["a", 0],
                ["b", 1],
            ]),
        )

        view.rerender(
            <DraggableGrid
                {...props}
                items={["a", "b"]}
                orderMap={
                    new Map([
                        ["a", 1],
                        ["b", 0],
                    ])
                }
            />,
        )

        expect(() => render(<DraggableGrid {...props} items={["a", "a"]} />)).toThrow("duplicate keys")
    })

    it("reorders grid items through a real drag and restores normal positioning on release", () => {
        const onOrderMapChange = vi.fn()
        render(<DraggableGrid items={["a", "b"]} columns={2} rows={1} itemWidth={100} itemHeight={50} onOrderMapChange={onOrderMapChange} />)
        const item = screen.getByText("a")
        fireEvent.mouseDown(item, { clientX: 0, clientY: 0 })
        fireEvent.mouseMove(window, { clientX: 100, clientY: 0 })

        expect(onOrderMapChange.mock.lastCall?.[0]).toEqual(
            new Map([
                ["a", 1],
                ["b", 0],
            ]),
        )

        expect(item.style.getPropertyValue("--transition-property")).toBe("none")
        fireEvent.mouseUp(window, { clientX: 100, clientY: 0 })
        expect(item.style.getPropertyValue("--translate-x")).toBe("100px")
        expect(item.style.getPropertyValue("--transition-property")).toBe("transform")
    })

    it("prevents disabled grid items from changing the order", () => {
        const onOrderMapChange = vi.fn()
        render(
            <DraggableGrid
                items={["a", "b"]}
                columns={2}
                rows={1}
                itemWidth={100}
                itemHeight={50}
                isItemDisabled={["a"]}
                onOrderMapChange={onOrderMapChange}
            />,
        )
        onOrderMapChange.mockClear()
        fireEvent.mouseDown(screen.getByText("a"), { clientX: 0, clientY: 0 })
        fireEvent.mouseMove(window, { clientX: 100, clientY: 0 })
        fireEvent.mouseUp(window)
        expect(onOrderMapChange).not.toHaveBeenCalled()
    })
})
