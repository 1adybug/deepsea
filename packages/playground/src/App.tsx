import { FC } from "react"
import { InputFileButton } from "deepsea-components"

const App: FC = () => {
    return (
        <div>
            <InputFileButton input={{ onChange: console.dir }} dragFile>上传文件</InputFileButton>
        </div>
    )
}

export default App
