"use client"

import { type ComponentProps, type FC, useImperativeHandle, useLayoutEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { renderToString } from "react-dom/server"

import { isBrowser } from "deepsea-tools"

import { getReactVersion } from "@/utils/getReactVersion"

const [major] = getReactVersion()

export const Title: FC<ComponentProps<"title">> = ({ ref, children, ...rest }) => {
    children = typeof children === "string" ? children : renderToString(children).replace(/<!-- -->/g, "")

    if (major >= 19) return <title ref={ref} {...rest} children={children} />

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const ele = useRef<HTMLTitleElement>(null)

    // eslint-disable-next-line react-hooks/rules-of-hooks, react-hooks/exhaustive-deps, react-hooks/refs
    useImperativeHandle(ref, () => ele.current as HTMLTitleElement, [ele.current])

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        const title = document.head.querySelector("title")
        if (title === ele.current) return
        document.head.insertBefore(ele.current as HTMLTitleElement, title)
    }, [])

    return isBrowser && createPortal(<title ref={ele} {...rest} children={children} />, document.head)
}
