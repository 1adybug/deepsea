declare module "robust-segment-intersect" {
    export type Point = [number, number]
    /** 
     * 判断两线段是否相交
     * @param a0 线段1的起点
     * @param a1 线段1的终点
     * @param b0 线段2的起点
     * @param b1 线段2的终点
     */
    function robustSegmentIntersect(a0: Point, a1: Point, b0: Point, b1: Point): boolean
    export default robustSegmentIntersect
}
