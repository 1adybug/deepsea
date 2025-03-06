import { FC } from "react"
import { message } from "antd"
import { useLongPress } from "soda-hooks"

const App: FC = () => {
    const ref = useLongPress<HTMLDivElement>(() => message.success("long press"), { preventDefault: false })

    return (
        <div ref={ref} >
            <a className="bg-red-500 p-2 text-white" href="https://www.baidu.com">
                Long Press
            </a>
        </div>
    )
}

export default App
