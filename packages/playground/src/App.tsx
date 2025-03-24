import { FC } from "react"
import { DateInput, HeroUIProvider } from "@heroui/react"

const App: FC = () => {
    return (
        <HeroUIProvider>
            <DateInput />
        </HeroUIProvider>
    )
}

export default App
