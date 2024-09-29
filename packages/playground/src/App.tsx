import { FC } from "react"
import { CopyButton, InputFileButton } from "deepsea-components"
import { useRef } from "react"
import { useEffect } from "react"

const App: FC = () => {

    const btn = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        console.log(btn.current)
    }, [])

    return (
        <div>
            <CopyButton ref={btn} text="Hello, World!" onCopySuccess={e => console.log("success")}>
                Copy
            </CopyButton>
        </div>
    )
}

export default App
