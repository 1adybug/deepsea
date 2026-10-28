import { afterEach, expect, it, vi } from "vitest"

import {
    base64ToBlob,
    createCookieStorage,
    createObservableStorage,
    cryptoRandomUUIDPolyfill,
    downloadBlob,
    getFilenameFromHeaders,
    getHeaders,
    isActiveHref,
    json2type,
} from "../src/index"

afterEach(() => {
    vi.unstubAllGlobals()
})

it("matches path, origin, hash and required query values", () => {
    expect(isActiveHref("/items?tag=a", "/items?tag=b&tag=a&extra=1")).toBe(true)
    for (const current of ["/other?tag=a", "/items?tag=b", "/items?tag=a#different", "https://elsewhere.test/items?tag=a"])
        expect(isActiveHref("/items?tag=a", current)).toBe(false)
    expect(isActiveHref({ pathname: "/", search: "", hash: "" }, { pathname: "/", search: "?extra=1", hash: "" })).toBe(true)
})

it("uses cookie storage semantics for empty strings, missing keys, removal and clear", () => {
    const storage = createCookieStorage()
    storage.clear()
    storage.setItem("a", "")
    storage.setItem("b", "测试")
    expect(storage.getItem("a")).toBe("")
    expect(storage.getItem("b")).toBe("测试")
    expect(storage.getItem("missing")).toBeNull()
    expect(storage.length).toBe(2)
    expect(storage.key(99)).toBeNull()
    storage.removeItem("b")
    expect(storage.length).toBe(1)
    storage.clear()
    expect(storage.length).toBe(0)
})

it("dispatches one clear event only when storage changes", () => {
    const storage = createObservableStorage(sessionStorage)
    const listener = vi.fn()
    window.addEventListener("storage", listener)

    try {
        storage.clear()
        storage.setItem("a", "1")
        const get = storage.getItem
        expect(get("a")).toBe("1")
        expect(storage.key(0)).toBe("a")
        storage.clear()
        storage.clear()
        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener.mock.lastCall?.[0]).toMatchObject({ key: null, oldValue: null, newValue: null, storageArea: sessionStorage })
    } finally {
        window.removeEventListener("storage", listener)
    }
})

it("parses copied headers and content-disposition filenames", () => {
    const headers = getHeaders("Content-Type:\napplication/json\nX-Token:\nvalue")
    expect(headers.get("content-type")).toBe("application/json")
    expect(headers.get("x-token")).toBe("value")
    expect(() => getHeaders("bad")).toThrow()
    expect(getFilenameFromHeaders(new Headers())).toBeUndefined()
    expect(getFilenameFromHeaders(new Headers({ "content-disposition": "attachment; filename=report.xlsx" }))).toBe("report.xlsx")
    expect(getFilenameFromHeaders(new Headers({ "content-disposition": 'attachment; filename="a;b.xlsx"; size=10' }))).toBe("a;b.xlsx")
    expect(getFilenameFromHeaders(new Headers({ "content-disposition": "attachment; filename*=UTF-8''%E6%B5%8B%E8%AF%95.xlsx" }))).toBe("测试.xlsx")
})

it("decodes data URLs and releases download object URLs", async () => {
    const blob = base64ToBlob("data:text/plain;base64,SGVsbG8=")
    expect(blob.type).toBe("text/plain")
    expect(blob.size).toBe(5)
    const create = vi.fn(() => "blob:http://localhost/download")
    const revoke = vi.fn()

    vi.stubGlobal(
        "URL",
        class extends URL {
            static createObjectURL = create
            static revokeObjectURL = revoke
        },
    )

    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
    downloadBlob(blob, "report.txt")
    expect(create).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledTimes(1)
    expect(revoke).toHaveBeenCalledWith("blob:http://localhost/download")
})

it("preserves native UUID support and installs a fallback when absent", () => {
    const native = crypto.randomUUID
    cryptoRandomUUIDPolyfill()
    expect(crypto.randomUUID).toBe(native)

    const stub = { getRandomValues: crypto.getRandomValues.bind(crypto) }

    vi.stubGlobal("crypto", stub)
    cryptoRandomUUIDPolyfill()
    expect(crypto.randomUUID()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
})

it("derives object types, optional merged fields and rejects invalid JSON", () => {
    expect(json2type("42")).toBe("number")
    expect(json2type("null")).toBe("null")
    const output = json2type('{"items":[{"id":1,"name":"a"},{"id":2}],"a-b":true}')
    expect(output).toContain("id: number")
    expect(output).toContain("name?: string | undefined")
    expect(output).toContain('"a-b": boolean')
    expect(() => json2type("{bad")).toThrow(SyntaxError)
})
