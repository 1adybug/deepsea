const storageMap = new WeakMap<Storage, Storage>()

const methodNames: (keyof Storage)[] = ["setItem", "removeItem", "clear"]

export function createObservableStorage(storage: Storage = globalThis.localStorage): Storage {
    // 1. 代理单例检查
    let proxy = storageMap.get(storage)

    if (proxy) return proxy

    // 2. 方法缓存存储（每个 Storage 实例一份）
    const methodMap = new Map<string | symbol, Function>()

    proxy = new Proxy(storage, {
        get(target, property) {
            const value = target[property as keyof Storage]

            // 非函数属性（如 length）直接返回
            if (typeof value !== "function") return value

            // 3. 检查缓存，确保引用一致性 (proxy.getItem === proxy.getItem)
            if (methodMap.has(property)) return methodMap.get(property)!

            let wrapped: Function

            // 4. 区分“增强方法”和“普通方法”
            if (methodNames.includes(property as keyof Storage)) {
                // 增强方法：处理事件分发
                wrapped = function wrapped(this: Storage, ...args: any[]) {
                    const prop = property as string
                    const key = args[0] as string
                    let oldValue: string | null = null
                    let newValue: string | null = null
                    let shouldDispatch = false

                    if (prop === "setItem") {
                        newValue = String(args[1])
                        oldValue = target.getItem(key)
                        if (oldValue === newValue) return
                        target.setItem(key, newValue)
                        shouldDispatch = true
                    } else if (prop === "removeItem") {
                        oldValue = target.getItem(key)
                        if (oldValue === null) return
                        target.removeItem(key)
                        newValue = null
                        shouldDispatch = true
                    } else if (prop === "clear") {
                        if (target.length === 0) return
                        target.clear()
                        shouldDispatch = true
                    }

                    if (shouldDispatch) {
                        window.dispatchEvent(
                            new StorageEvent("storage", {
                                key: prop === "clear" ? null : key,
                                oldValue,
                                newValue,
                                storageArea: target,
                                url: window.location.href,
                            }),
                        )
                    }
                }
            } else wrapped = value.bind(target)

            // 5. 修正函数名并存入缓存
            Object.defineProperty(wrapped, "name", {
                value: value.name,
                configurable: true,
            })

            methodMap.set(property, wrapped)
            return wrapped
        },
    })

    storageMap.set(storage, proxy)
    return proxy
}
