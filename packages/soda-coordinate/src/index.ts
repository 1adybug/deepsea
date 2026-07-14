import segmentIntersect from "robust-segment-intersect"

export { default as pointInPolygon } from "robust-point-in-polygon"
export { default as segmentIntersect } from "robust-segment-intersect"

export type CoordType = "WGS84" | "GCJ02" | "BD09"

export interface CoordObject {
    longitude: number
    latitude: number
}

export interface CoordBase extends CoordObject {
    type: CoordType
    longitude: number
    latitude: number
}

const DEFAULT_COORD_TYPE: CoordType = "WGS84"

export type CoordTuple = [longitude: number, latitude: number]

export type CoordString = string

export type CoordInput = CoordObject | CoordTuple | CoordString

export type CoordConstructorArgs =

        | [longitude: number, latitude: number]
        | [coord: CoordInput]
        | [type: CoordType, longitude: number, latitude: number]
        | [longitude: number, latitude: number, type: CoordType]
        | [type: CoordType, coord: CoordInput]
        | [coord: CoordInput, type: CoordType]

/**
 * 判断值是否为支持的坐标系类型
 * @param {unknown} value 待判断的值
 * @returns {boolean} 是否为支持的坐标系类型
 */
export function isCoordType(value: unknown): value is CoordType {
    return value === "WGS84" || value === "GCJ02" || value === "BD09"
}

/**
 * 判断值是否为带坐标系类型的坐标对象
 * @param {unknown} value 待判断的值
 * @returns {boolean} 是否为 CoordBase
 */
export function isCoordBase(value: unknown): value is CoordBase {
    return typeof value === "object" && value !== null && isCoordType((value as CoordBase).type)
}

/**
 * 解析字符串形式的坐标
 * @param {CoordString} coord 逗号分隔的坐标字符串，格式为 longitude,latitude
 * @returns {CoordObject} 坐标对象
 */
function parseCoordString(coord: CoordString): CoordObject {
    const parts = coord.split(",").map(item => item.trim())

    if (parts.length !== 2 || parts.some(item => item.length === 0)) throw new Error(`${coord} 不是一个有效的坐标字符串`)

    const [longitude, latitude] = parts.map(Number)

    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) throw new Error(`${coord} 不是一个有效的坐标字符串`)

    return { longitude, latitude }
}

/**
 * 标准化坐标输入
 * @param {CoordInput} coord 坐标输入
 * @returns {CoordObject} 坐标对象
 */
export function normalizeCoord(coord: CoordInput): CoordObject {
    if (typeof coord === "string") return parseCoordString(coord)

    if (Array.isArray(coord)) {
        const items = coord as unknown[]

        if (items.length !== 2) throw new Error(`${items.join(",")} 不是一个有效的坐标数组`)

        const [longitude, latitude] = coord
        return { longitude, latitude }
    }

    return coord
}

/**
 * 标准化 Coord 构造函数参数
 * @param {CoordConstructorArgs} args 构造函数参数
 * @returns {CoordBase} 带坐标系类型的坐标对象
 */
export function normalizeCoordArgs(args: CoordConstructorArgs): CoordBase {
    if (args.length === 1) {
        const [coord] = args

        const { longitude, latitude } = normalizeCoord(coord)
        const type = isCoordBase(coord) ? coord.type : DEFAULT_COORD_TYPE

        return { type, longitude, latitude }
    }

    if (args.length === 2) {
        const [first, second] = args

        if (typeof first === "number" && typeof second === "number") return { type: DEFAULT_COORD_TYPE, longitude: first, latitude: second }

        if (isCoordType(first)) {
            const { longitude, latitude } = normalizeCoord(second as CoordInput)
            return { type: first, longitude, latitude }
        }

        const { longitude, latitude } = normalizeCoord(first as CoordInput)
        return { type: second as CoordType, longitude, latitude }
    }

    const [first, second, third] = args

    if (isCoordType(first)) return { type: first, longitude: second as number, latitude: third as number }

    return { type: third as CoordType, longitude: first as number, latitude: second as number }
}

export class Coord implements CoordBase {
    type: CoordType
    longitude: number
    latitude: number

    constructor(longitude: number, latitude: number)
    constructor(coord: CoordObject)
    constructor(coord: CoordTuple)
    constructor(coord: CoordString)
    constructor(type: CoordType, longitude: number, latitude: number)
    constructor(longitude: number, latitude: number, type: CoordType)
    constructor(type: CoordType, coord: CoordObject)
    constructor(coord: CoordObject, type: CoordType)
    constructor(type: CoordType, coord: CoordTuple)
    constructor(coord: CoordTuple, type: CoordType)
    constructor(type: CoordType, coord: CoordString)
    constructor(coord: CoordString, type: CoordType)
    constructor(coord: CoordBase)
    constructor(...args: CoordConstructorArgs)

    constructor(...args: CoordConstructorArgs) {
        const { type, longitude, latitude } = normalizeCoordArgs(args)

        this.type = type
        this.longitude = longitude
        this.latitude = latitude
    }

    /**
     * @deprecated please use `.toWGS84()` instead
     * @returns {Coord} WGS84 坐标
     */
    getWGS84(): Coord {
        return this.toWGS84()
    }

    /**
     * 转换为 WGS84 坐标
     * @returns {Coord} WGS84 坐标
     */
    toWGS84(): Coord {
        switch (this.type) {
            case "GCJ02": {
                const [longitude, latitude] = GCJ02ToWGS84([this.longitude, this.latitude])
                return new Coord({ type: "WGS84", longitude, latitude })
            }
            case "BD09": {
                const [longitude1, latitude1] = BD09ToWGS84([this.longitude, this.latitude])
                return new Coord({ type: "WGS84", longitude: longitude1, latitude: latitude1 })
            }
            default:
                return new Coord(this)
        }
    }

    /**
     * @deprecated please use `.toGCJ02()` instead
     * @returns {Coord} GCJ02 坐标
     */
    getGCJ02(): Coord {
        return this.toGCJ02()
    }

    /**
     * 转换为 GCJ02 坐标
     * @returns {Coord} GCJ02 坐标
     */
    toGCJ02(): Coord {
        switch (this.type) {
            case "WGS84": {
                const [longitude, latitude] = WGS84ToGCJ02([this.longitude, this.latitude])
                return new Coord({ type: "GCJ02", longitude, latitude })
            }
            case "BD09": {
                const [longitude1, latitude1] = BD09ToGCJ02([this.longitude, this.latitude])
                return new Coord({ type: "GCJ02", longitude: longitude1, latitude: latitude1 })
            }
            default:
                return new Coord(this)
        }
    }

    /**
     * @deprecated please use `.toBD09()` instead
     * @returns {Coord} BD09 坐标
     */
    getBD09(): Coord {
        return this.toBD09()
    }

    /**
     * 转换为 BD09 坐标
     * @returns {Coord} BD09 坐标
     */
    toBD09(): Coord {
        switch (this.type) {
            case "WGS84": {
                const [longitude, latitude] = WGS84ToBD09([this.longitude, this.latitude])
                return new Coord({ type: "BD09", longitude, latitude })
            }
            case "GCJ02": {
                const [longitude1, latitude1] = GCJ02ToBD09([this.longitude, this.latitude])
                return new Coord({ type: "BD09", longitude: longitude1, latitude: latitude1 })
            }
            default:
                return new Coord(this)
        }
    }

    /**
     * 转换为指定坐标系的 Coord
     * @param {CoordType} [type=this.type] 目标坐标系类型
     * @returns {Coord} 指定坐标系的 Coord
     */
    toCoord(type: CoordType = this.type): Coord {
        switch (type) {
            case "WGS84":
                return this.toWGS84()
            case "GCJ02":
                return this.toGCJ02()
            case "BD09":
                return this.toBD09()
        }
    }

    /**
     * 转换为数组形式坐标
     * @param {CoordType} [type] 目标坐标系类型
     * @returns {CoordTuple} 数组形式坐标
     */
    toTuple(type?: CoordType): CoordTuple {
        const { longitude, latitude } = this.toCoord(type)
        return [longitude, latitude]
    }

    /**
     * 转换为字符串形式坐标
     * @param {CoordType} [type] 目标坐标系类型
     * @returns {CoordString} 字符串形式坐标，格式为 longitude,latitude
     */
    toString(type?: CoordType): CoordString {
        return this.toTuple(type).join(",")
    }
}

export function coord(longitude: number, latitude: number): Coord
export function coord(value: CoordObject): Coord
export function coord(value: CoordTuple): Coord
export function coord(value: CoordString): Coord
export function coord(type: CoordType, longitude: number, latitude: number): Coord
export function coord(longitude: number, latitude: number, type: CoordType): Coord
export function coord(type: CoordType, value: CoordObject): Coord
export function coord(value: CoordObject, type: CoordType): Coord
export function coord(type: CoordType, value: CoordTuple): Coord
export function coord(value: CoordTuple, type: CoordType): Coord
export function coord(type: CoordType, value: CoordString): Coord
export function coord(value: CoordString, type: CoordType): Coord
export function coord(value: CoordBase): Coord
export function coord(...args: CoordConstructorArgs): Coord {
    return new Coord(...args)
}

const PI = 3.141592653589793
const x_PI = (PI * 3000.0) / 180.0
const ee = 0.006693421622965943

/** 地球半径 ，单位米*/
export const EarthRadius = 6378245.0

/**
 * getCoordinateOffset 获取火星坐标系(GCJ-02)坐标与地球坐标系(WGS84)坐标的偏移量
 * @param {CoordTuple} coordinate 火星坐标系(GCJ-02)坐标
 * @returns {CoordTuple} 坐标偏移量
 */
function getCoordinateOffset(coordinate: CoordTuple): CoordTuple {
    const [longitude, latitude] = coordinate
    let dLng = 300.0 + longitude + 2.0 * latitude + 0.1 * longitude * longitude + 0.1 * longitude * latitude + 0.1 * Math.sqrt(Math.abs(longitude))
    dLng += ((20.0 * Math.sin(6.0 * longitude * PI) + 20.0 * Math.sin(2.0 * longitude * PI)) * 2.0) / 3.0
    dLng += ((20.0 * Math.sin(longitude * PI) + 40.0 * Math.sin((longitude / 3.0) * PI)) * 2.0) / 3.0
    dLng += ((150.0 * Math.sin((longitude / 12.0) * PI) + 300.0 * Math.sin((longitude / 30.0) * PI)) * 2.0) / 3.0
    let dLat = -100.0 + 2.0 * longitude + 3.0 * latitude + 0.2 * latitude * latitude + 0.1 * longitude * latitude + 0.2 * Math.sqrt(Math.abs(longitude))
    dLat += ((20.0 * Math.sin(6.0 * longitude * PI) + 20.0 * Math.sin(2.0 * longitude * PI)) * 2.0) / 3.0
    dLat += ((20.0 * Math.sin(latitude * PI) + 40.0 * Math.sin((latitude / 3.0) * PI)) * 2.0) / 3.0
    dLat += ((160.0 * Math.sin((latitude / 12.0) * PI) + 320 * Math.sin((latitude * PI) / 30.0)) * 2.0) / 3.0
    return [dLng, dLat]
}

/**
 * 判断坐标是否在中国范围内
 * @param {CoordTuple} coordinate 坐标
 * @returns {boolean} 坐标是否在中国范围内
 */
export function inChina(coordinate: CoordTuple): boolean {
    /** 大陆 */
    const region: CoordTuple[][] = [
        [
            [79.4462, 49.2204],
            [96.33, 42.8899],
        ],
        [
            [109.6872, 54.1415],
            [135.0002, 39.3742],
        ],
        [
            [73.1246, 42.8899],
            [124.143255, 29.5297],
        ],
        [
            [82.9684, 29.5297],
            [97.0352, 26.7186],
        ],
        [
            [97.0253, 29.5297],
            [124.367395, 20.414096],
        ],
        [
            [107.975793, 20.414096],
            [111.744104, 17.871542],
        ],
    ]

    /** 台湾未做偏移 */
    const exclude: CoordTuple[][] = [
        [
            [119.921265, 25.398623],
            [122.497559, 21.785006],
        ],
        [
            [101.8652, 22.284],
            [106.665, 20.0988],
        ],
        [
            [106.4525, 21.5422],
            [108.051, 20.4878],
        ],
        [
            [109.0323, 55.8175],
            [119.127, 50.3257],
        ],
        [
            [127.4568, 55.8175],
            [137.0227, 49.5574],
        ],
        [
            [131.2662, 44.8922],
            [137.0227, 42.5692],
        ],
    ]

    return region.some(item => inRectangle(coordinate, item[0], item[1])) && !exclude.some(item => inRectangle(coordinate, item[0], item[1]))
}

/**
 * 判断是否在范围内
 * @param {CoordTuple} coordinate 坐标
 * @param {CoordTuple} start 起点坐标
 * @param {CoordTuple} end 终点坐标
 * @returns {boolean} 坐标是否在矩形范围内
 */
function inRectangle(coordinate: CoordTuple, start: CoordTuple, end: CoordTuple): boolean {
    const [sLng, sLat] = start
    const [eLng, eLat] = end
    const [longitude, latitude] = coordinate
    const minLng = Math.min(sLng, eLng)
    const maxLng = Math.max(sLng, eLng)
    const minLat = Math.min(sLat, eLat)
    const maxLat = Math.max(sLat, eLat)
    return longitude >= minLng && longitude <= maxLng && latitude >= minLat && latitude <= maxLat
}

/**
 * WGS84ToGCJ02 地球坐标系(WGS84)转火星坐标系(GCJ-02)
 * @param {CoordTuple} WGS84Coordinate WGS84坐标
 * @returns {CoordTuple} GCJ02 坐标
 */
export function WGS84ToGCJ02(WGS84Coordinate: CoordTuple): CoordTuple {
    const [WGS84Longitude, WGS84Latitude] = WGS84Coordinate
    const x = WGS84Longitude - 105.0
    const y = WGS84Latitude - 35.0
    let [dLng, dLat] = getCoordinateOffset([x, y])
    const radLat = (WGS84Latitude / 180.0) * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLng = (dLng * 180.0) / ((EarthRadius / sqrtMagic) * Math.cos(radLat) * PI)
    dLat = (dLat * 180.0) / (((EarthRadius * (1 - ee)) / (magic * sqrtMagic)) * PI)
    const GCJLongitude = WGS84Longitude + dLng
    const GCJLatitude = WGS84Latitude + dLat
    return [GCJLongitude, GCJLatitude]
}

/**
 * GCJ02ToWGS84 火星坐标系(GCJ-02)转地球坐标系(WGS84)
 * @param {CoordTuple} GCJCoordinate 火星坐标系(GCJ-02)坐标
 * @returns {CoordTuple} WGS84 坐标
 */
export function GCJ02ToWGS84(GCJCoordinate: CoordTuple): CoordTuple {
    const [GCJLongitude, GCJLatitude] = GCJCoordinate
    const x = GCJLongitude - 105.0
    const y = GCJLatitude - 35.0
    let [dLng, dLat] = getCoordinateOffset([x, y])
    const radLat = (GCJLatitude / 180.0) * PI
    let magic = Math.sin(radLat)
    magic = 1 - ee * magic * magic
    const sqrtMagic = Math.sqrt(magic)
    dLng = (dLng * 180.0) / ((EarthRadius / sqrtMagic) * Math.cos(radLat) * PI)
    dLat = (dLat * 180.0) / (((EarthRadius * (1 - ee)) / (magic * sqrtMagic)) * PI)
    const WGS84Longitude = GCJLongitude - dLng
    const WGS84Latitude = GCJLatitude - dLat
    return [WGS84Longitude, WGS84Latitude]
}

/**
 * BD09ToGCJ02 百度坐标系(BD-09)转火星坐标系(GCJ-02)
 * @param {CoordTuple} BDCoordinate 百度坐标系(BD-09)坐标
 * @returns {CoordTuple} GCJ02 坐标
 */
export function BD09ToGCJ02(BDCoordinate: CoordTuple): CoordTuple {
    const [BDLongitude, BDLatitude] = BDCoordinate
    const x = BDLongitude - 0.0065
    const y = BDLatitude - 0.006
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
    const GCJLongitude = z * Math.cos(theta)
    const GCJLatitude = z * Math.sin(theta)
    return [GCJLongitude, GCJLatitude]
}

/**
 * GCJ02ToBD09 火星坐标系(GCJ-02)转百度坐标系(BD-09)
 * @param {CoordTuple} GCJCoordinate 火星坐标系(GCJ-02)坐标
 * @returns {CoordTuple} BD09 坐标
 */
export function GCJ02ToBD09(GCJCoordinate: CoordTuple): CoordTuple {
    const [GCJLongitude, GCJLatitude] = GCJCoordinate
    const z = Math.sqrt(GCJLongitude * GCJLongitude + GCJLatitude * GCJLatitude) + 0.00002 * Math.sin(GCJLatitude * x_PI)
    const theta = Math.atan2(GCJLatitude, GCJLongitude) + 0.000003 * Math.cos(GCJLongitude * x_PI)
    const BDLongitude = z * Math.cos(theta) + 0.0065
    const BDLatitude = z * Math.sin(theta) + 0.006
    return [BDLongitude, BDLatitude]
}

/**
 * BD09ToWGS84 百度坐标系(BD-09)转地球坐标系(WGS84)
 * @param {CoordTuple} BDCoordinate 百度坐标系(BD-09)坐标
 * @returns {CoordTuple} WGS84 坐标
 */
export function BD09ToWGS84(BDCoordinate: CoordTuple): CoordTuple {
    return GCJ02ToWGS84(BD09ToGCJ02(BDCoordinate))
}

/**
 * WGS84ToBD09 地球坐标系(WGS84)转百度坐标系(BD-09)
 * @param {CoordTuple} WGS84Coordinate WGS84坐标
 * @returns {CoordTuple} BD09 坐标
 */
export function WGS84ToBD09(WGS84Coordinate: CoordTuple): CoordTuple {
    return GCJ02ToBD09(WGS84ToGCJ02(WGS84Coordinate))
}

/**
 * 获取两个经纬度坐标之间的距离
 * @param {CoordTuple} coord1 - 经纬度一，[经度, 维度]
 * @param {CoordTuple} coord2 - 经纬度二，[经度, 维度]
 * @returns {number} 距离：米
 */
export function getDistance(coord1: CoordTuple, coord2: CoordTuple): number {
    /**
     * 角度转弧度
     * @param {number} d 角度
     * @returns {number} 弧度
     */
    function toRadians(d: number): number {
        return (d * Math.PI) / 180
    }

    const [lng1, lat1] = coord1
    if (Math.abs(lng1) > 180) throw new Error(`${lng1} 不是一个有效的经度值`)
    if (Math.abs(lat1) > 90) throw new Error(`${lat1} 不是一个有效的纬度值`)
    const [lng2, lat2] = coord2
    if (Math.abs(lng2) > 180) throw new Error(`${lng2} 不是一个有效的经度值`)
    if (Math.abs(lat2) > 90) throw new Error(`${lat2} 不是一个有效的纬度值`)
    const radLat1 = toRadians(lat1)
    const radLat2 = toRadians(lat2)
    const deltaLat = radLat1 - radLat2
    const deltaLng = toRadians(lng1) - toRadians(lng2)
    const dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)))
    return dis * EarthRadius
}

/**
 * 判断两个线段是否相交
 * @param {CoordTuple[]} line1 - 线段一
 * @param {CoordTuple[]} line2 - 线段二
 * @returns {boolean} 两个线段是否相交
 */
export function ifTwoSegmentsIntersect(line1: CoordTuple[], line2: CoordTuple[]): boolean {
    const [a, b] = line1
    const [c, d] = line2
    return segmentIntersect(a, b, c, d)
}

/**
 * 判断多个点能否围成多边形
 * @param {CoordTuple[]} coords - 多边形的顶点
 * @returns {boolean} 多个点能否围成多边形
 */
export function canCoordsBePolygon(coords: CoordTuple[]): boolean {
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

/**
 * 获取到两个经纬度坐标之间的固定距离的可能的坐标
 * @param {CoordTuple} coord 经纬度一，[经度, 维度]
 * @param {CoordTuple} coord2 经纬度二，[经度, 维度]
 * @param {number} d 距离一，单位：米
 * @param {number} d2 距离二，单位：米
 * @returns {CoordTuple[]} 可能的两个坐标
 */
export function getCoordsWithCertainDistance(coord: CoordTuple, coord2: CoordTuple, d: number, d2: number): CoordTuple[] {
    const [longitude, latitude] = coord
    const [longitude2, latitude2] = coord2

    const [m, n] = [latitude2 - latitude, longitude2 - longitude]

    const s = getDistance(coord, [longitude, latitude2]) / m
    const t = getDistance(coord, [longitude2, latitude]) / n
    const e = m * s
    const f = n * t
    const g = -e / f
    const h = (e ** 2 + f ** 2 + d ** 2 - d2 ** 2) / (2 * f)
    const a = g ** 2 + 1
    const b = 2 * g * h
    const c = h ** 2 - d ** 2
    const ox1 = (-b + (b ** 2 - 4 * a * c) ** (1 / 2)) / (2 * a)
    const oy1 = g * ox1 + h
    const ox2 = (-b - (b ** 2 - 4 * a * c) ** (1 / 2)) / (2 * a)
    const oy2 = g * ox2 + h
    return [
        [oy1 / t + longitude, ox1 / s + latitude],
        [oy2 / t + longitude, ox2 / s + latitude],
    ]
}
