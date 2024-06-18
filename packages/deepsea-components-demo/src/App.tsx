import { InfiniteScroll } from "deepsea-components"
import { FC } from "react"

const App: FC = () => {
    return (
        <InfiniteScroll style={{ width: 400, height: 400 }} direction="horizontal" gap={0} duration={10000} withEqual>
            <img style={{ display: "block" }} src="/a.jpg" width={400} height={400} />
        </InfiniteScroll>
    )
}

export default App
