import { describe, expect, it, vi } from "vitest"

import { createObservableStorage } from "../src/utils/createObservableStorage"
import { getPagination } from "../src/utils/getPagination"

describe("pagination", () => {
    it("slices a final partial page and computes empty-state boundaries", () => {
        expect(getPagination({ data: [1, 2, 3, 4, 5], pageNum: 2, pageSize: 3 })).toMatchObject({
            list: [4, 5],
            pages: 2,
            startRow: 4,
            endRow: 5,
            isLastPage: true,
            nextPage: 0,
        })

        expect(getPagination({ data: [], pageNum: 1, pageSize: 10 })).toMatchObject({ list: [], pages: 0, startRow: 0, endRow: 0 })
    })

    it("accepts already paginated data with a remote total", () => {
        expect(getPagination({ data: [31, 32], exact: true, total: 32, pageNum: 4, pageSize: 10 })).toMatchObject({
            list: [31, 32],
            startRow: 31,
            endRow: 32,
            total: 32,
            isLastPage: true,
        })
    })
})

it("storage emits one event per real change and preserves stable bound methods", () => {
    const storage = createObservableStorage(localStorage)
    expect(createObservableStorage(localStorage)).toBe(storage)
    expect(storage.getItem).toBe(storage.getItem)
    const listener = vi.fn()
    window.addEventListener("storage", listener)

    try {
        storage.setItem("key", "one")
        storage.setItem("key", "one")
        storage.removeItem("missing")
        storage.removeItem("key")
        expect(listener).toHaveBeenCalledTimes(2)
        expect(listener.mock.calls[0]![0]).toMatchObject({ key: "key", oldValue: null, newValue: "one", storageArea: localStorage })
    } finally {
        window.removeEventListener("storage", listener)
    }
})
