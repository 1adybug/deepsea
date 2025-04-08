import { FC } from "react"
import { DateInput, HeroUIProvider } from "@heroui/react"
import { pointInPolygon } from "soda-coordinate"

type A = typeof pointInPolygon

const App: FC = () => {
    return (
        <HeroUIProvider>
            <DateInput />
        </HeroUIProvider>
    )
}

export default App
