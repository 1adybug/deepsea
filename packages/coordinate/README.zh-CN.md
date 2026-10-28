# @1adybug/coordinate

[English](README.md) | [简体中文](README.zh-CN.md)

经纬度表示、WGS84/GCJ02/BD09 坐标转换与几何工具。

## 能力

- 类型化 Coord 对象，支持元组、字符串和对象输入，以及不修改原对象的坐标转换。
- 以米为单位的距离计算、区域判断、线段相交、多边形检查和按距离求候选坐标。

## 安装与运行环境

```sh
pnpm add @1adybug/coordinate
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

本包未声明 peer 依赖。

## 快速开始

```tsx
import { coord, getDistance } from "@1adybug/coordinate"

const point = coord("WGS84", 116.397128, 39.916527)
const gcj = point.toGCJ02()
const baidu = gcj.toBD09().toTuple()

getDistance([0, 0], [1, 0]) // meters
```

## 公开 API

| 模块                         | 导出                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `pointInPolygon`, `segmentIntersect`, `CoordType`, `CoordObject`, `CoordBase`, `CoordTuple`, `CoordString`, `CoordInput`, `CoordConstructorArgs`, `isCoordType`, `isCoordBase`, `normalizeCoord`, `normalizeCoordArgs`, `Coord`, `coord`, `EarthRadius`, `inChina`, `WGS84ToGCJ02`, `GCJ02ToWGS84`, `BD09ToGCJ02`, `GCJ02ToBD09`, `BD09ToWGS84`, `WGS84ToBD09`, `getDistance`, `ifTwoSegmentsIntersect`, `canCoordsBePolygon`, `getCoordsWithCertainDistance` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

元组顺序为 [经度, 纬度]。坐标转换为近似算法，转换函数不会自动应用 inChina 判断；需要地域限制时应显式判断。区域检测使用粗略的包含与排除矩形。按距离求候选点采用局部平面近似。

## 测试与开发

```sh
pnpm --filter @1adybug/coordinate... build
pnpm --filter @1adybug/coordinate test
pnpm --filter @1adybug/coordinate test:types
```

构造函数重载、格式错误、固定转换参考值、转换往返、距离对称与范围、线段接触、自相交及区域包含与排除。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
