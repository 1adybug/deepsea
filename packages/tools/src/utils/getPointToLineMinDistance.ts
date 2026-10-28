/**
 * 获取点到线的最短距离
 * @param point 点的坐标
 * @param line 线的坐标
 * @param getDis 获取距离的方法
 * @returns 点到线的最短距离
 */
export function getPointToLineMinDistance(point: number[], line: number[][], getDis?: (a: number[], b: number[]) => number) {
    const method = getDis || ((a: number[], b: number[]) => Math.pow(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2), 1 / 2))
    if (point.length !== 2) throw new Error("无效坐标")
    if (line.length < 2) throw new Error("线的坐标至少含有两个坐标")
    const [x0, y0] = point
    return Math.min(
        ...line
            .slice(0, -1)
            .map((item, index) => [item, line[index + 1]])
            .map(item => {
                const [[x1, y1], [x2, y2]] = item
                if (x1 === x2 && y1 === y2) return method(point, [x1, y1])
                if ((x0 === x1 && y0 === y1) || (x0 === x2 && y0 === y2)) return 0

                if (x1 === x2) {
                    if ((y0 - y1) * (y0 - y2) < 0) return method(point, [x1, y0])
                    return Math.min(method(point, [x1, y1]), method(point, [x2, y2]))
                }

                if (y1 === y2) {
                    if ((x0 - x1) * (x0 - x2) < 0) return method(point, [x0, y1])
                    return Math.min(method(point, [x1, y1]), method(point, [x2, y2]))
                }

                const k = (y2 - y1) / (x2 - x1)
                const x = (x0 / k + y0 + k * x1 - y1) / (k + 1 / k)
                const y = (y1 / k + x0 + k * y0 - x1) / (k + 1 / k)
                if ((x - x1) * (x - x2) < 0 && (y - y1) * (y - y2) < 0) return method(point, [x, y])
                return Math.min(method(point, [x1, y1]), method(point, [x2, y2]))
            }),
    )
}
