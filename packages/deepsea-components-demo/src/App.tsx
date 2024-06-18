import { InfiniteScroll } from "deepsea-components"
import { FC } from "react"

const App: FC = () => {
    return (
        <InfiniteScroll style={{ width: 400, height: 400 }} direction="horizontal" gap={0} duration={10000} withEqual pauseOnHover>
            <div className="w-[400px] h-[400px] bg-blue-300">1</div>
        </InfiniteScroll>
    )
}

export default App
