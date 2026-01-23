import { SetStateAction, useCallback, useSyncExternalStore } from "react"

import { createObservableStorage } from "deepsea-tools"

export interface UseStorageStateParams {
    key: string
    storage: Storage
    subscribe: (onStoreChange: () => void) => () => void
    getServerSnapshot?: () => string | null
}

export function useStorageState({ key, storage, subscribe, getServerSnapshot }: UseStorageStateParams) {
    const getSnapshot = useCallback(() => storage.getItem(key), [storage, key])
    getServerSnapshot ??= () => null

    const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

    const setState = useCallback(
        function setState(action: SetStateAction<string | null>) {
            const prev = storage.getItem(key)
            const next = typeof action === "function" ? action(prev) : action
            if (prev === next) return

            if (next === null) storage.removeItem(key)
            else storage.setItem(key, next)
        },
        [storage, key],
    )

    return [state, setState] as const
}

export function createUseStorageState(storage: Storage) {
    storage = createObservableStorage(storage)

    function useStorageState2(params: UseStorageStateParams) {
        return useStorageState({ ...params, storage })
    }

    useStorageState2.storage = storage

    return useStorageState2
}
