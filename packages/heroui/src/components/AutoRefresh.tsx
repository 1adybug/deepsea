import type { FC, ReactNode } from "react"

import { useAutoRefresh } from "@1adybug/hooks"
import type { FirstParameter } from "@1adybug/types"
import { type PressEvent, addToast, Button } from "@heroui/react"

export interface AutoRefreshProps extends FirstParameter<typeof addToast> {
    onRefresh?: () => void
    children?: ReactNode
}

export const AutoRefresh: FC<AutoRefreshProps> = ({ children, onRefresh, ...rest }) => {
    if (process.env.NODE_ENV === "development") return children

    function onPress(e: PressEvent) {
        const closeButton = e.target.parentElement?.querySelector(`[aria-label="关闭"]`) as HTMLButtonElement
        closeButton?.click()
        onRefresh?.()
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAutoRefresh(() =>
        addToast({
            title: "检测到页面更新",
            description: "为了最佳的体验，请刷新页面",
            color: "warning",
            timeout: Infinity,
            endContent: (
                <Button color="warning" size="sm" variant="flat" onPress={onPress}>
                    刷新
                </Button>
            ),
            ...rest,
        }),
    )

    return children
}
