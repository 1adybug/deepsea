import { describe, expect, it } from "vitest"

import {
    BD09ToWGS84,
    coord,
    GCJ02ToWGS84,
    getCoordsWithCertainDistance,
    getDistance,
    isCoordBase,
    normalizeCoordArgs,
    WGS84ToBD09,
    WGS84ToGCJ02,
} from "../src/index"

describe("conversion entry contracts", () => {
    it("retains explicit coordinate types and supports standalone conversion chains", () => {
        const start: [number, number] = [116.397128, 39.916527]

        const gcj = WGS84ToGCJ02(start)
        const bd = WGS84ToBD09(start)
        expect(GCJ02ToWGS84(gcj)[0]).toBeCloseTo(start[0], 4)
        expect(BD09ToWGS84(bd)[1]).toBeCloseTo(start[1], 4)
        expect(normalizeCoordArgs([{ type: "BD09", longitude: 1, latitude: 2 }])).toEqual({ type: "BD09", longitude: 1, latitude: 2 })
        expect(isCoordBase(coord("GCJ02", start))).toBe(true)
        expect(isCoordBase(null)).toBe(false)
        expect(isCoordBase({ type: "other" })).toBe(false)
    })
})

describe("distance-constrained coordinates", () => {
    it.each([
        [0.01, 0.01],
        [0.01, 0],
        [0, 0.01],
    ] as [number, number][])("solves diagonal and axis-aligned centers (%s,%s)", (longitude, latitude) => {
        const center: [number, number] = [0, 0],
            other: [number, number] = [longitude, latitude]

        const points = getCoordsWithCertainDistance(center, other, 1200, 1200)
        expect(points).toHaveLength(2)

        for (const point of points) {
            expect(point.every(Number.isFinite)).toBe(true)
            expect(Math.abs(getDistance(center, point) - 1200)).toBeLessThan(1)
            expect(Math.abs(getDistance(other, point) - 1200)).toBeLessThan(1)
        }
    })

    it("returns no candidates for separate, contained or coincident circles", () => {
        expect(getCoordsWithCertainDistance([0, 0], [0.01, 0.01], 1, 1)).toEqual([])
        expect(getCoordsWithCertainDistance([0, 0], [0.01, 0], 3000, 1)).toEqual([])
        expect(getCoordsWithCertainDistance([0, 0], [0, 0], 1, 1)).toEqual([])
        expect(() => getCoordsWithCertainDistance([0, 0], [0.01, 0], -1, 1)).toThrow(RangeError)
    })
})
