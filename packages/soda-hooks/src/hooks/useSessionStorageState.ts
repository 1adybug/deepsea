import { Dispatch, SetStateAction } from "react"

import { StorageStateHookDataConfig, StorageStateHookStringConfig, useStorageState } from "./useStorageState"

export function useSessionStorageState(key: string): [string | null, Dispatch<SetStateAction<string | null>>]
export function useSessionStorageState(
    key: string,
    config: Omit<StorageStateHookStringConfig, "storage" | "key">,
): [string | null, Dispatch<SetStateAction<string | null>>]
export function useSessionStorageState<Data>(
    key: string,
    config: Omit<StorageStateHookDataConfig<Data>, "storage" | "key">,
): [Data, Dispatch<SetStateAction<Data>>]
export function useSessionStorageState<Data>(key: string, config?: Omit<StorageStateHookStringConfig | StorageStateHookDataConfig<Data>, "storage" | "key">) {
    const c = { key, storage: sessionStorage, ...config }

    return useStorageState(c as any)
}
