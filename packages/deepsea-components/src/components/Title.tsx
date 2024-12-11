"use client"

import { ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react"
import { createPortal } from "react-dom"

import { getReactVersion } from "../utils/getReactVersion"

export type TitleProps = ComponentPropsWithoutRef<"title">

const [major] = getReactVersion()

export const Title = forwardRef<HTMLTitleElement, TitleProps>((props, ref) => {
    if (major >= 19) return <title ref={ref} {...props} />

    const ele = useRef<HTMLTitleElement>(null)

    useImperativeHandle(ref, () => ele.current as HTMLTitleElement, [ele.current])

    useLayoutEffect(() => {
        const title = document.head.querySelector("title")
        if (title === ele.current) return
        document.head.insertBefore(ele.current as HTMLTitleElement, title)
    }, [])

    return createPortal(<title ref={ele} {...props} />, document.head)
})
