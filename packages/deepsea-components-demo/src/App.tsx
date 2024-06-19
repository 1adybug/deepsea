import { InfiniteScroll, Line } from "deepsea-components"
import { FC } from "react"

const App: FC = () => {
    return (
        <div className="h-[400px] w-[400px]">
            <Line
                width={400}
                height={400}
                option={{
                    xAxis: {
                        type: "category",
                        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    },
                    yAxis: {
                        type: "value"
                    },
                    series: [
                        {
                            data: [150, 230, 224, 218, 135, 147, 260],
                            type: "line"
                        }
                    ]
                }}
            />
        </div>
    )
}

export default App
