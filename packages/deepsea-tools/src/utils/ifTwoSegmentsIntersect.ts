import robustSegmentIntersect from "robust-segment-intersect"

/**
 * 判断两个线段是否相交
 * @param line1 - 线段一
 * @param line2 - 线段二
 * @returns 是否相交
 */
export function ifTwoSegmentsIntersect(line1: number[][], line2: number[][]) {
    const [a, b] = line1
    const [c, d] = line2
    return robustSegmentIntersect(a, b, c, d)
}
