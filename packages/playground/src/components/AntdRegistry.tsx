import { StyleProvider } from "@ant-design/cssinjs"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import { FC, ReactNode } from "react"

export type AntdRegistryProps = {
    children?: ReactNode
}

const AntdRegistry: FC<AntdRegistryProps> = props => {
    const { children } = props

    return (
        <ConfigProvider locale={zhCN}>
            <StyleProvider hashPriority="high">{children}</StyleProvider>
        </ConfigProvider>
    )
}

export default AntdRegistry
