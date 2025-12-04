import { CSSProperties, MutableRefObject, useEffect, useLayoutEffect } from "react"

export type ThirdPartyImageErrorHandlerTarget = HTMLElement | Window | Document | MutableRefObject<HTMLElement>

export interface ThirdPartyImageErrorHandlerOptions {
    target?: ThirdPartyImageErrorHandlerTarget
    content: string | [string, string]
    backgroundColor?: CSSProperties["backgroundColor"]
    fontSize?: CSSProperties["fontSize"]
    fontFamily?: CSSProperties["fontFamily"]
    color?: CSSProperties["color"]
    lineHeight?: CSSProperties["lineHeight"]
}

function targetIsMutableRefObject(target: ThirdPartyImageErrorHandlerTarget): target is MutableRefObject<HTMLElement> {
    return target !== null && typeof target === "object" && "current" in target && target.current instanceof HTMLElement
}

/**
 * 用于处理第三方图片加载失败的 hook
 */
export function useThirdPartyImageErrorHandler(options: ThirdPartyImageErrorHandlerOptions) {
    const { target = window, content, backgroundColor, fontSize, color, lineHeight, fontFamily } = options
    const [before, after] = typeof content === "string" ? [content, undefined] : content

    useEffect(() => {
        function listener(e: Event) {
            const { target } = e

            // 判断是否是图片元素的错误
            if (!(target instanceof HTMLImageElement)) return

            const url = new URL(target.src)

            // 判断是否是第三方的图片
            if (url.origin === location.origin) return

            // 添加 data-third-party-image-error 属性
            target.dataset.thirdPartyImageError = ""
        }

        const instance = targetIsMutableRefObject(target) ? target.current : target
        instance.addEventListener("error", listener, true)
        return () => instance.removeEventListener("error", listener, true)
    }, [target])

    useLayoutEffect(() => {
        const style = document.createElement("style")

        function isNonNull<T>(value: T | null | undefined): value is T {
            return value !== null && value !== undefined
        }

        style.innerHTML = `[data-third-party-image-error] {
    position: relative;
}

[data-third-party-image-error]::before {
    content: "${before}";
    ${isNonNull(backgroundColor) ? `background-color: ${backgroundColor};` : ""}
    ${isNonNull(fontSize) ? `font-size: ${fontSize};` : ""}
    ${isNonNull(color) ? `color: ${color};` : ""}
    ${isNonNull(lineHeight) ? `line-height: ${lineHeight};` : ""}
    ${isNonNull(fontFamily) ? `font-family: ${fontFamily};` : ""}
    position: absolute;
    width: 100%;
    height: ${isNonNull(after) ? "50%" : "100%"};
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: ${isNonNull(after) ? "flex-end" : "center"};
}

${
    isNonNull(after)
        ? `[data-third-party-image-error]::after {
    content: "${after}";
    ${isNonNull(backgroundColor) ? `background-color: ${backgroundColor};` : ""}
    ${isNonNull(fontSize) ? `font-size: ${fontSize};` : ""}
    ${isNonNull(color) ? `color: ${color};` : ""}
    ${isNonNull(lineHeight) ? `line-height: ${lineHeight};` : ""}
    ${isNonNull(fontFamily) ? `font-family: ${fontFamily};` : ""}
    position: absolute;
    width: 100%;
    height: 50%;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}`
        : ""
}`
        document.head.appendChild(style)
        return () => {
            document.head.removeChild(style)
        }
    }, [before, after, backgroundColor, fontSize, color, lineHeight, fontFamily])
}
