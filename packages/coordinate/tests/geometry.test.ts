import { describe, expect, it } from "vitest"

import {
    BD09ToGCJ02,
    canCoordsBePolygon,
    coord,
    Coord,
    EarthRadius,
    GCJ02ToBD09,
    getDistance,
    ifTwoSegmentsIntersect,
    inChina,
    isCoordType,
    normalizeCoord,
} from "../src/index"

describe("coordinate inputs and projections", () => {
    it.each(["WGS84", "GCJ02", "BD09"] as const)("accepts all constructor arrangements for %s", type => {
        const expected = { type, longitude: 116.4, latitude: 39.9 }

        for (const value of [
            coord(type, 116.4, 39.9),
            coord(116.4, 39.9, type),
            coord(type, [116.4, 39.9]),
            coord([116.4, 39.9], type),
            coord(type, "116.4,39.9"),
            coord("116.4,39.9", type),
            coord(expected),
            coord({ longitude: 116.4, latitude: 39.9 }, type),
        ]) {
            expect(value).toMatchObject(expected)
            expect(value.toCoord()).not.toBe(value)
            expect(value.toTuple()).toEqual([116.4, 39.9])
            expect(value.toString()).toBe("116.4,39.9")
        }
    })

    it.each(["1,Infinity", "NaN,1", ",2", "1,2,3", " , "])("rejects invalid strings %s", input => {
        expect(() => normalizeCoord(input)).toThrow()
    })

    it("rejects malformed tuples and identifies supported systems", () => {
        expect(() => normalizeCoord([1] as never)).toThrow()
        expect(isCoordType("WGS84")).toBe(true)
        expect(isCoordType("wgs84")).toBe(false)
        expect(isCoordType(null)).toBe(false)
    })

    it("matches a fixed GCJ02 reference and preserves the original coordinate", () => {
        const origin = new Coord(116.397128, 39.916527)
        const gcj = origin.toGCJ02()
        expect(gcj.longitude).toBeCloseTo(116.4033725, 6)
        expect(gcj.latitude).toBeCloseTo(39.9179307, 6)
        expect(origin.toTuple()).toEqual([116.397128, 39.916527])
        expect(BD09ToGCJ02(GCJ02ToBD09(gcj.toTuple()))[0]).toBeCloseTo(gcj.longitude, 5)
        expect(origin.getWGS84()).toEqual(origin.toWGS84())
        expect(origin.getGCJ02()).toEqual(gcj)
        expect(origin.getBD09()).toEqual(origin.toBD09())
    })
})

describe("geometry", () => {
    it("computes geodesic distances in meters and is symmetric", () => {
        expect(getDistance([0, 0], [0, 0])).toBe(0)
        expect(getDistance([0, 0], [90, 0])).toBeCloseTo((Math.PI * EarthRadius) / 2, 5)
        expect(getDistance([120, 30], [121, 31])).toBeCloseTo(getDistance([121, 31], [120, 30]), 8)
    })

    it.each([
        [
            [181, 0],
            [0, 0],
        ],
        [
            [0, -91],
            [0, 0],
        ],
        [
            [0, 0],
            [-181, 0],
        ],
        [
            [0, 0],
            [0, 91],
        ],
    ] as const)("rejects out-of-range endpoints", (a, b) => {
        expect(() => getDistance([...a], [...b])).toThrow()
    })

    it("distinguishes intersecting, touching and separate segments", () => {
        expect(
            ifTwoSegmentsIntersect(
                [
                    [0, 0],
                    [2, 2],
                ],
                [
                    [0, 2],
                    [2, 0],
                ],
            ),
        ).toBe(true)

        expect(
            ifTwoSegmentsIntersect(
                [
                    [0, 0],
                    [1, 0],
                ],
                [
                    [1, 0],
                    [2, 0],
                ],
            ),
        ).toBe(true)

        expect(
            ifTwoSegmentsIntersect(
                [
                    [0, 0],
                    [1, 0],
                ],
                [
                    [2, 0],
                    [3, 0],
                ],
            ),
        ).toBe(false)
    })

    it("rejects too few vertices and self-intersecting polygons", () => {
        expect(
            canCoordsBePolygon([
                [0, 0],
                [1, 1],
            ]),
        ).toBe(false)

        expect(
            canCoordsBePolygon([
                [0, 0],
                [2, 2],
                [0, 2],
                [2, 0],
            ]),
        ).toBe(false)

        expect(
            canCoordsBePolygon([
                [0, 0],
                [2, 0],
                [2, 2],
                [0, 2],
            ]),
        ).toBe(true)

        expect(inChina([116.4, 39.9])).toBe(true)
        expect(inChina([-74, 40.7])).toBe(false)
        expect(inChina([121.5, 25])).toBe(false)
    })
})
