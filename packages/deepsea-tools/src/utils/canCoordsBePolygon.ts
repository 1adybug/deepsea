import { ifTwoSegmentsIntersect } from "./ifTwoSegmentsIntersect"

/**
 * 判断多个点能否围成多边形
 * @param coords - 多边形的顶点
 * @returns 是否能围成多边形
 */
export function canCoordsBePolygon(coords: number[][]) {
    const { length } = coords
    if (length < 3) return false
    const lines = coords.map((coord, index) => [coord, coords[(index + 1) % length]])

    for (let i = 0; i < length; i++) {
        for (let j = i + 2; j < length; j++) {
            if (i === 0 && j === length - 1) continue
            if (ifTwoSegmentsIntersect(lines[i], lines[j])) return false
        }
    }

    return true
}
