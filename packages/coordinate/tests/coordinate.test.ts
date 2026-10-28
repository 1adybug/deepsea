import { describe, expect, it } from "vitest"

import { coord, normalizeCoord } from "../src/index"

describe("coordinate conversion", () => {
    it("normalizes supported inputs and rejects malformed strings", () => {
        expect(normalizeCoord(" 116.4, 39.9 ")).toEqual({ longitude: 116.4, latitude: 39.9 })
        expect(coord([116.4, 39.9]).toTuple()).toEqual([116.4, 39.9])
        for (const value of ["", "1,", "a,2", "1,2,3"]) expect(() => normalizeCoord(value)).toThrow()
    })

    it("round-trips Chinese coordinates across GCJ02 and BD09", () => {
        const start = coord("WGS84", 116.397128, 39.916527)
        const restored = start.toGCJ02().toBD09().toWGS84()
        expect(restored.longitude).toBeCloseTo(start.longitude, 4)
        expect(restored.latitude).toBeCloseTo(start.latitude, 4)
        expect(start.type).toBe("WGS84")
    })
})
