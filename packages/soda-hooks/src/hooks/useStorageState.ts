import { Dispatch, SetStateAction, useMemo, useState } from "react"

export interface Storage {
    getItem(key: string): string | null
    setItem(key: string, value: string): any
    removeItem(key: string): any
}

export interface StorageStateHookStringConfig {
    key: string
    storage: Storage
    parser?: (value: string | null) => string | null
    serializer?: (value: string | null) => string | null
}

export interface StorageStateHookDataConfig<Data> {
    key: string
    storage: Storage
    parser: (value: string | null) => Data
    serializer: (value: Data) => string | null
}

/**
 * 用于存储状态到 storage 中，当 storage 中的值发生变化时，state 也会发生变化
 */
export function useStorageState(config: StorageStateHookStringConfig): [string | null, Dispatch<SetStateAction<string | null>>]
export function useStorageState<Data>(config: StorageStateHookDataConfig<Data>): [Data, Dispatch<SetStateAction<Data>>]
export function useStorageState<Data>(config: StorageStateHookStringConfig | StorageStateHookDataConfig<Data>) {
    const { key, storage, parser, serializer } = config

    const [state, setState] = useState(() => {
        const value = storage.getItem(key)
        return parser ? parser(value) : value
    })

    useMemo(() => {
        const value = serializer ? serializer(state as any) : state
        if (value === null) {
            storage.removeItem(key)
        } else {
            storage.setItem(key, value as string)
        }
    }, [state])

    return [state, setState]
}
