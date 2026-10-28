import { getRemain } from "./getRemain"

export interface DrawArcOptions {
    /** 到达绘制起点的方式，true 为连线，false 为移动，默认 false */
    line?: boolean
    /** 起点到终点的方式，true 为逆时针，false 为顺时针，默认 false */
    anticlockwise?: boolean
}

/**
 * 用 canvas 的方法画 path 的圆
 * @param x 圆弧中心（圆心）的 x 轴坐标
 * @param y 圆弧中心（圆心）的 y 轴坐标
 * @param radius 圆弧的半径
 * @param startAngle 圆弧的起始点，x 轴方向开始计算，单位以弧度表示
 * @param endAngle 圆弧的终点，单位以弧度表示
 * @param options 其他绘制选项
 * @returns path 字符串
 */
export function drawArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, options: DrawArcOptions = {}) {
    startAngle = getRemain(startAngle, Math.PI * 2)
    endAngle = getRemain(endAngle, Math.PI * 2)
    const { line = false, anticlockwise = false } = options

    return `${line ? "L" : "M"} ${x + radius * Math.cos(startAngle)} ${y + radius * Math.sin(startAngle)} A ${radius} ${radius} 0 ${anticlockwise ? (startAngle > endAngle ? "0 0" : "1 0") : startAngle > endAngle ? "1 1" : "0 1"} ${x + radius * Math.cos(endAngle)} ${y + radius * Math.sin(endAngle)}`
}
