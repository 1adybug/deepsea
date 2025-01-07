import { FC } from "react"
import { useQueryState } from "soda-react-router"

type A = {
    a: number
} & Record<string, any>

const a: A = { a: 1 }

const App: FC = () => {
    const [query, setQuery] = useQueryState({
        parse: {
            d: Number,
        },
        exact: false,
    })

    query.d

    return (
        <div>
            <div>
                <pre>{JSON.stringify(query, null, 4)}</pre>
            </div>
            <div>
                <button onClick={() => setQuery({ a: "1" })}>set a=1</button>
                <button onClick={() => setQuery({ b: "2" })}>set b=2</button>
                <button onClick={() => setQuery({ c: "3", d: 99, e:999 })}>set c=3</button>
            </div>
        </div>
    )
}

export default App
