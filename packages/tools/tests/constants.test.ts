import { expect, it } from "vitest"

import {
    canCoordsBePolygon,
    DEFAULT_TIME_FORMAT,
    digits,
    emailReg,
    idReg,
    ifTwoSegmentsIntersect,
    intReg,
    isBrowser,
    isDev,
    isProd,
    ONE_LAT,
    ONE_LNG,
    plateNoAlphabets,
    plateNoReg,
    plateNoRegNew,
    plateNoRegOld,
    uintReg,
} from "../src/index"

it("validates positive and negative examples for the exported format patterns", () => {
    expect(idReg.test("11010519491231002X")).toBe(true)
    expect(idReg.test("bad")).toBe(false)
    expect(plateNoReg.test("苏H12345")).toBe(true)
    expect(plateNoRegOld.test("苏H12345")).toBe(true)
    expect(plateNoRegNew.test("苏HD12345")).toBe(true)
    for (const pattern of [plateNoReg, plateNoRegOld, plateNoRegNew]) expect(pattern.test("invalid")).toBe(false)
    expect(emailReg.test("name@example.test")).toBe(true)
    expect(emailReg.test("missing-at.test")).toBe(false)
    expect(intReg.test("-12")).toBe(true)
    expect(intReg.test("1.5")).toBe(false)
    expect(uintReg.test("0")).toBe(true)
    expect(uintReg.test("-1")).toBe(false)
    expect(digits).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(plateNoAlphabets).not.toContain("I")
    expect(plateNoAlphabets).not.toContain("O")
    expect(DEFAULT_TIME_FORMAT).toBe("YYYY-MM-DD HH:mm:ss")
    expect(ONE_LAT).toBeGreaterThan(ONE_LNG)
    expect(isBrowser).toBe(true)
    expect(isDev).toBe(process.env.NODE_ENV === "development")
    expect(isProd).toBe(process.env.NODE_ENV === "production")
})

it("checks simple polygons and robust intersection through the tools entry", () => {
    expect(canCoordsBePolygon([])).toBe(false)

    expect(
        canCoordsBePolygon([
            [0, 0],
            [2, 0],
            [1, 1],
        ]),
    ).toBe(true)

    expect(
        canCoordsBePolygon([
            [0, 0],
            [2, 2],
            [0, 2],
            [2, 0],
        ]),
    ).toBe(false)

    expect(
        ifTwoSegmentsIntersect(
            [
                [0, 0],
                [2, 0],
            ],
            [
                [1, -1],
                [1, 1],
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
