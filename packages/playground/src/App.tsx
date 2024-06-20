import { FC, useState } from "react"
import { useTransitionNum } from "soda-hooks"

const App: FC = () => {
    const [target, setTarget] = useState(0)
    const num = useTransitionNum(target)

    return (
        <div>
            <div>{num.toString().padStart(6, "0")}</div>
            <div>
                <button onClick={() => setTarget(t => t + 200)}>Increment</button>
            </div>
        </div>
    )
}

export default App
