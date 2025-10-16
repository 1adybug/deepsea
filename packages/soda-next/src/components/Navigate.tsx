"use client"

import { FC } from "react"
import { isBrowser } from "deepsea-tools"
import { useRouter } from "next/navigation"

export interface NavigateProps {
    /** 跳转的地址 */
    to: string
    /** 是否替换历史记录，默认为 false */
    replace?: boolean
}

export const Navigate: FC<NavigateProps> = ({ to, replace }) => {
    const router = useRouter()
    if (isBrowser) replace ? router.replace(to) : router.push(to)
    return null
}
