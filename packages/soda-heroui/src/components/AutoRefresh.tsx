import { FC, ReactNode } from "react"
import { Button, PressEvent, addToast } from "@heroui/react"
import { useAutoRefresh } from "soda-hooks"
import { FirstParameter } from "soda-type"

export interface AutoRefreshProps extends FirstParameter<typeof addToast> {
    onNavigate?: () => void
    children?: ReactNode
}

const AutoRefresh: FC<AutoRefreshProps> = ({ children, onNavigate, ...rest }) => {
    if (process.env.NODE_ENV === "development") return children

    function onPress(e: PressEvent) {
        const closeButton = e.target.parentElement?.querySelector(`[aria-label="关闭"]`) as HTMLButtonElement
        closeButton?.click()
        onNavigate?.()
    }

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

export default AutoRefresh
