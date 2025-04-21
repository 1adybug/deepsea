import { FC } from "react"
import { ScrollMask } from "deepsea-components"

const App: FC = () => {
    return (
        <div className="h-96 w-96 overflow-y-auto">
            <ScrollMask position="top" />
            <ScrollMask position="bottom" />
            <div className="h-[200px] bg-red-500"></div>
        </div>
    )
}

export default App
