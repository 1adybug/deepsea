import Cookies from "js-cookie"

import type { CookieAttributes } from "node_modules/@types/js-cookie"

export type { CookieAttributes } from "node_modules/@types/js-cookie"

export interface CookieStorage extends Storage {
    setItem(key: string, value: string, options?: CookieAttributes): void
}

/**
 * 创建 cookie 的存储
 * @returns 返回一个 Storage 对象
 */
export function createCookieStorage(): CookieStorage {
    const cookieStorage: CookieStorage = {
        get length() {
            return Object.keys(Cookies.get() || {}).length
        },
        clear() {
            Object.keys(Cookies.get() || {})?.forEach(key => Cookies.remove(key))
        },
        getItem(key) {
            return Cookies.get(key) || null
        },
        setItem(key, value, options) {
            Cookies.set(key, value, options)
        },
        key(index) {
            return Object.keys(Cookies.get())[index]
        },
        removeItem(key) {
            Cookies.remove(key)
        },
    }

    return cookieStorage
}
