import { FC } from "react"
import { useNativeQueryState } from "soda-hooks"

const App: FC = () => {
    const [query, setQuery] = useNativeQueryState({
        keys: ["a", "b"]
    })

    return (
        <div>
            <button onClick={() => (setQuery(q => ({ ...q, a: "1" })), setQuery(q => ({ ...q, b: "2" })))}>change</button>
            <button onClick={() => setQuery({})}>change</button>
        </div>
    )
}

export default App
