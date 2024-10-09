import Cookies from "js-cookie"

/**
 * 创建 cookie 的存储
 * @returns 返回一个 Storage 对象
 */
export function createCookieStorage(): Storage {
    const cookieStorage: Storage = {
        get length() {
            return Object.keys(Cookies.get() || {}).length
        },
        clear() {
            Object.keys(Cookies.get() || {})?.forEach(key => Cookies.remove(key))
        },
        getItem(key) {
            return Cookies.get(key) || null
        },
        setItem(key, value) {
            Cookies.set(key, value)
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
