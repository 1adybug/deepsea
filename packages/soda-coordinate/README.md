# soda-coordinate

[![NPM version](https://img.shields.io/npm/v/soda-coordinate.svg?style=flat)](https://npmjs.org/package/soda-coordinate)
[![NPM downloads](http://img.shields.io/npm/dm/soda-coordinate.svg?style=flat)](https://npmjs.org/package/soda-coordinate)

`soda-coordinate` 是一个轻量的经纬度坐标工具包，提供常见中国地图坐标系转换、坐标输入标准化、两点距离计算、线段相交判断、多边形合法性判断等能力。

支持的坐标系：

- `WGS84`：GPS / 地球坐标系
- `GCJ02`：国测局 / 火星坐标系，常见于高德、腾讯地图
- `BD09`：百度坐标系

> 所有坐标数组均使用 `[longitude, latitude]` 顺序，即 `[经度, 纬度]`。

## 安装

```bash
pnpm add soda-coordinate
# 或
npm i soda-coordinate
# 或
yarn add soda-coordinate
```

## 快速开始

```ts
import { Coord, getDistance, WGS84ToGCJ02 } from "soda-coordinate"

const wgs84 = new Coord("WGS84", 116.397428, 39.90923)
const gcj02 = wgs84.toGCJ02()

console.log(gcj02.type) // "GCJ02"

console.log(gcj02.toTuple()) // [longitude, latitude]

console.log(gcj02.toString()) // "longitude,latitude"

const direct = WGS84ToGCJ02([116.397428, 39.90923])

const distance = getDistance([116.397428, 39.90923], [121.473701, 31.230416])

console.log(distance) // 单位：米
```

## 基础类型

```ts
type CoordType = "WGS84" | "GCJ02" | "BD09"

type CoordTuple = [longitude: number, latitude: number]

type CoordString = string

interface CoordObject {
    longitude: number
    latitude: number
}

interface CoordBase extends CoordObject {
    type: CoordType
}
```

坐标输入支持三种形式：

```ts
import { normalizeCoord } from "soda-coordinate"

normalizeCoord([116.397428, 39.90923])
normalizeCoord("116.397428,39.90923")
normalizeCoord({ longitude: 116.397428, latitude: 39.90923 })
```

## `Coord` 类

`Coord` 用于保存一个带坐标系类型的坐标，并提供链式风格的转换方法。

### 构造方式

```ts
import { Coord } from "soda-coordinate"

new Coord(116.397428, 39.90923) // 默认 WGS84

new Coord([116.397428, 39.90923]) // 默认 WGS84

new Coord("116.397428,39.90923") // 默认 WGS84

new Coord({ longitude: 116.397428, latitude: 39.90923 }) // 默认 WGS84

new Coord("GCJ02", 116.397428, 39.90923)
new Coord(116.397428, 39.90923, "GCJ02")
new Coord("GCJ02", [116.397428, 39.90923])
new Coord([116.397428, 39.90923], "GCJ02")

new Coord({ type: "BD09", longitude: 116.397428, latitude: 39.90923 })
```

当没有显式传入坐标系时，默认使用 `WGS84`。如果传入的对象本身包含合法的 `type` 字段，则会沿用该字段。

### 坐标系转换

```ts
const coord = new Coord("WGS84", 116.397428, 39.90923)

coord.toWGS84()
coord.toGCJ02()
coord.toBD09()
coord.toCoord("BD09")
```

`getWGS84()`、`getGCJ02()`、`getBD09()` 仍然可用，但已废弃，建议改用 `toWGS84()`、`toGCJ02()`、`toBD09()`。

### 输出格式

```ts
const coord = new Coord("WGS84", 116.397428, 39.90923)

coord.toTuple() // 当前坐标系：[longitude, latitude]

coord.toString() // 当前坐标系："longitude,latitude"

coord.toTuple("BD09") // 转为 BD09 后输出数组

coord.toString("GCJ02") // 转为 GCJ02 后输出字符串
```

## 坐标系转换函数

如果不需要 `Coord` 实例，也可以直接使用转换函数。

```ts
import { BD09ToGCJ02, BD09ToWGS84, GCJ02ToBD09, GCJ02ToWGS84, WGS84ToBD09, WGS84ToGCJ02 } from "soda-coordinate"

WGS84ToGCJ02([116.397428, 39.90923])
GCJ02ToWGS84([116.403963, 39.910093])
GCJ02ToBD09([116.403963, 39.910093])
BD09ToGCJ02([116.410369, 39.916879])
WGS84ToBD09([116.397428, 39.90923])
BD09ToWGS84([116.410369, 39.916879])
```

## 距离计算

```ts
import { getDistance } from "soda-coordinate"

const distance = getDistance([116.397428, 39.90923], [121.473701, 31.230416])
```

返回值单位为米。传入的经度必须在 `[-180, 180]` 范围内，纬度必须在 `[-90, 90]` 范围内，否则会抛出错误。

## 几何判断

### 判断点是否在多边形内

`soda-coordinate` 重新导出了 `robust-point-in-polygon`：

```ts
import { pointInPolygon } from "soda-coordinate"

const result = pointInPolygon(
    [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
    ],
    [5, 5],
)

// result:
// -1: 点在多边形内部
//  0: 点在多边形边界上
//  1: 点在多边形外部
```

### 判断线段是否相交

```ts
import { ifTwoSegmentsIntersect, segmentIntersect } from "soda-coordinate"

ifTwoSegmentsIntersect(
    [
        [0, 0],
        [10, 10],
    ],
    [
        [0, 10],
        [10, 0],
    ],
)

segmentIntersect([0, 0], [10, 10], [0, 10], [10, 0])
```

`ifTwoSegmentsIntersect` 是包内封装方法；`segmentIntersect` 是重新导出的 `robust-segment-intersect`。

### 判断顶点能否组成简单多边形

```ts
import { canCoordsBePolygon } from "soda-coordinate"

canCoordsBePolygon([
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10],
]) // true

canCoordsBePolygon([
    [0, 0],
    [10, 10],
    [0, 10],
    [10, 0],
]) // false，边之间存在交叉
```

## 按距离求可能坐标

`getCoordsWithCertainDistance` 用于计算同时满足以下条件的可能坐标：

- 距离 `coord` 为 `d` 米
- 距离 `coord2` 为 `d2` 米

```ts
import { getCoordsWithCertainDistance } from "soda-coordinate"

const points = getCoordsWithCertainDistance([116.397428, 39.90923], [116.407428, 39.90923], 500, 500)

// 通常返回两个可能点
```

该方法适合两个圆相交的定位场景。由于经纬度到米的换算使用局部近似，建议用于小范围内的估算。

## 工具函数

| API                        | 说明                                                           |
| -------------------------- | -------------------------------------------------------------- |
| `isCoordType(value)`       | 判断值是否为 `WGS84` / `GCJ02` / `BD09`                        |
| `isCoordBase(value)`       | 判断值是否为带合法 `type` 字段的坐标对象                       |
| `normalizeCoord(coord)`    | 将数组、字符串或对象形式坐标标准化为 `{ longitude, latitude }` |
| `normalizeCoordArgs(args)` | 标准化 `Coord` 构造函数参数                                    |
| `inChina(coord)`           | 判断坐标是否在中国范围内                                       |
| `EarthRadius`              | 距离计算使用的地球半径常量，单位米                             |

## API 总览

| API                                                  | 类型     | 说明                           |
| ---------------------------------------------------- | -------- | ------------------------------ |
| `Coord`                                              | class    | 带坐标系类型的坐标对象         |
| `WGS84ToGCJ02(coord)`                                | function | WGS84 转 GCJ02                 |
| `GCJ02ToWGS84(coord)`                                | function | GCJ02 转 WGS84                 |
| `GCJ02ToBD09(coord)`                                 | function | GCJ02 转 BD09                  |
| `BD09ToGCJ02(coord)`                                 | function | BD09 转 GCJ02                  |
| `WGS84ToBD09(coord)`                                 | function | WGS84 转 BD09                  |
| `BD09ToWGS84(coord)`                                 | function | BD09 转 WGS84                  |
| `getDistance(coord1, coord2)`                        | function | 计算两点距离，单位米           |
| `ifTwoSegmentsIntersect(line1, line2)`               | function | 判断两条线段是否相交           |
| `canCoordsBePolygon(coords)`                         | function | 判断顶点序列能否组成简单多边形 |
| `getCoordsWithCertainDistance(coord, coord2, d, d2)` | function | 根据到两个点的距离求可能坐标   |
| `pointInPolygon(polygon, point)`                     | function | 判断点与多边形的位置关系       |
| `segmentIntersect(a0, a1, b0, b1)`                   | function | 判断两条线段是否相交           |

## 注意事项

- 坐标数组始终是 `[经度, 纬度]`，不要写成 `[纬度, 经度]`。
- 坐标系转换函数不会自动调用 `inChina` 跳过境外坐标；如果业务需要只在中国范围内转换，请在调用前自行判断。
- `GCJ02ToWGS84` 是常见近似反算，不是严格意义上的无损逆变换。
- `normalizeCoord` 对字符串会校验格式与数字有效性；对对象和数组主要做结构转换，业务侧仍建议自行校验坐标范围。

## 本地开发

```bash
pnpm install
pnpm --filter soda-coordinate dev
pnpm --filter soda-coordinate build
```

## License

MIT
