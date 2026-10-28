# @1adybug/coordinate

[English](README.md) | [简体中文](README.zh-CN.md)

Longitude/latitude representations, WGS84/GCJ02/BD09 conversions and geometry helpers.

## Features

- Typed Coord objects with tuple, string and object inputs and immutable conversion methods.
- Distances in meters, region checks, segment intersection, polygon checks and candidate coordinates from distances.

## Installation and requirements

```sh
pnpm add @1adybug/coordinate
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```tsx
import { coord, getDistance } from "@1adybug/coordinate"

const point = coord("WGS84", 116.397128, 39.916527)
const gcj = point.toGCJ02()
const baidu = gcj.toBD09().toTuple()

getDistance([0, 0], [1, 0]) // meters
```

## Public API

| Module                       | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `pointInPolygon`, `segmentIntersect`, `CoordType`, `CoordObject`, `CoordBase`, `CoordTuple`, `CoordString`, `CoordInput`, `CoordConstructorArgs`, `isCoordType`, `isCoordBase`, `normalizeCoord`, `normalizeCoordArgs`, `Coord`, `coord`, `EarthRadius`, `inChina`, `WGS84ToGCJ02`, `GCJ02ToWGS84`, `BD09ToGCJ02`, `GCJ02ToBD09`, `BD09ToWGS84`, `WGS84ToBD09`, `getDistance`, `ifTwoSegmentsIntersect`, `canCoordsBePolygon`, `getCoordsWithCertainDistance` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Tuple ordering is [longitude, latitude]. Coordinate transforms are approximate, and conversion functions do not automatically apply an inChina guard. Call `inChina` explicitly when geographic scoping matters. Region checks use coarse inclusion/exclusion rectangles. Candidate coordinate solving uses a local planar approximation.

## Tests and development

```sh
pnpm --filter @1adybug/coordinate... build
pnpm --filter @1adybug/coordinate test
pnpm --filter @1adybug/coordinate test:types
```

Constructor overloads, normalization failures, fixed conversion references, conversion round-trips, distance symmetry/bounds, segment contact, self-intersections and region inclusion/exclusion.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
