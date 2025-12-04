"use client"

import { ComponentProps, FC, useImperativeHandle, useLayoutEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { renderToString } from "react-dom/server"

import { isBrowser } from "deepsea-tools"

import { getReactVersion } from "@/utils/getReactVersion"

const [major] = getReactVersion()

export const Title: FC<ComponentProps<"title">> = ({ ref, children, ...rest }) => {
    children = typeof children === "string" ? children : renderToString(children).replace(/<!-- -->/g, "")

    if (major >= 19) return <title ref={ref} {...rest} children={children} />

    const ele = useRef<HTMLTitleElement>(null)

    useImperativeHandle(ref, () => ele.current as HTMLTitleElement, [ele.current])

    useLayoutEffect(() => {
        const title = document.head.querySelector("title")
        if (title === ele.current) return
        document.head.insertBefore(ele.current as HTMLTitleElement, title)
    }, [])

    return isBrowser && createPortal(<title ref={ele} {...rest} children={children} />, document.head)
}
