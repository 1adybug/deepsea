import { addToast } from "@heroui/react"
import { clsx, nanoid } from "deepsea-tools"

export type AddToastParams = Parameters<typeof addToast>[0]

export interface AddBetterToastParams extends Omit<AddToastParams, "promise"> {
    key?: string
    loading?: boolean
}

export function closeToast(key: string) {
    const closeButton = document.querySelector(`.toast-${key}-close-button`) as HTMLButtonElement
    if (!closeButton) console.warn(`Toast with key ${key} not found`)
    closeButton?.click()
}

export function addBetterToast({ key, loading, onClose, classNames, ...rest }: AddBetterToastParams) {
    key ??= nanoid()
    classNames = { ...classNames }
    classNames.closeButton = clsx(classNames.closeButton, `toast-${key}-close-button`)

    if (loading) {
        const { promise, resolve } = Promise.withResolvers<void>()

        function newOnClose() {
            resolve()
            onClose?.()
        }

        addToast({
            classNames,
            promise,
            onClose: newOnClose,
            ...rest,
        })
    } else {
        addToast({
            classNames,
            onClose,
            ...rest,
        })
    }

    return key
}
