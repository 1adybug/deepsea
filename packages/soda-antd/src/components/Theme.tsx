import { ConfigProvider } from "antd"
import { ComponentProps, FC, ReactNode } from "react"

export type ComponentsConfig = NonNullable<NonNullable<ComponentProps<typeof ConfigProvider>["theme"]>["components"]>

export type ThemeComponentProps<T extends keyof ComponentsConfig> = NonNullable<ComponentsConfig[T]> & {
    children?: ReactNode
}

export type ThemeMap = {
    [Key in keyof ComponentsConfig]: FC<ThemeComponentProps<Key>>
}

function getComponent<T extends keyof ComponentsConfig>(key: T) {
    const Component: FC<ThemeComponentProps<T>> = ({ children, ...rest }) => (
        <ConfigProvider theme={{ components: { [key]: rest } }}>{children}</ConfigProvider>
    )
    return Component
}

const themeMap = {} as Required<ThemeMap>

export const Theme = new Proxy(themeMap, {
    get(target, property) {
        target[property as keyof ComponentsConfig] ??= getComponent(property as keyof ComponentsConfig) as any
        return target[property as keyof ComponentsConfig]
    },
})
