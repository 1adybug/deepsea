import { message } from "antd"
import { FC } from "react"
import { useLongPress } from "soda-hooks"

const App: FC = () => {
    const ref = useLongPress<HTMLAnchorElement>(
        () => {
            message.success("long press")
        },
        {
            threshold: 1000,
            onStart: () => {
                console.log("start")
            },
        },
    )

    return (
        <div>
            <a style={{ display: "block" }} ref={ref} href="https://www.baidu.com">
                Long Press
            </a>
        </div>
    )
}

export default App
