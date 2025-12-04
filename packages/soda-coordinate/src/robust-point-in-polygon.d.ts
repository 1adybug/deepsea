declare module "robust-point-in-polygon" {
    export type Point = [number, number]

    /**
     * 判断点是否在多边形内部
     * @param polygon 多边形的顶点
     * @param point 待判断的点
     * @returns -1: 点在多边形外部, 0: 点在多边形边界上, 1: 点在多边形内部
     */
    function robustPointInPolygon(polygon: Point[], point: Point): -1 | 0 | 1
    export default robustPointInPolygon
}
