# @1adybug/types

[English](README.md) | [简体中文](README.zh-CN.md)

Compile-time TypeScript utilities for union analysis, strict object transformations, tuple indexing, function parameters and query models.

## Features

- Union keys, optionality, intersections and recursive combination.
- Timestamp-to-range query types and selective optional, required or readonly properties.

## Installation and requirements

```sh
pnpm add @1adybug/types
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```tsx
import type { QueryParams, StrictPartial, ValueOf } from "@1adybug/types"

type RecordData = { id: number; createdAt: Date; label: string }

type Search = QueryParams<RecordData, number>

// id, label, createdAfter, createdBefore
type Draft = StrictPartial<RecordData, "id">

type Status = ValueOf<{ ready: "ready"; idle: "idle" }>
```

## Public API

| Module                       | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `Equal`, `IsNever`, `UnionToIntersection`, `LastUnion`, `UnionToTuple`, `IsRequired`, `KeyOfUnion`, `IsOptionalInUnion`, `IsRequiredInUnion`, `OptionalKeysInUnion`, `RequiredKeysInUnion`, `PossibleValuesInUnion`, `IsObject`, `ObjectInUnion`, `ArrayInUnion`, `NonObjectOrArrayInUnion`, `CombineUnion`, `CommonType`, `CanJSONStringify`, `TipString`, `EditorProps`, `StrictOmit`, `ValueOf`, `FirstParameter`, `StrictPartial`, `StrictRequired`, `StrictReadonly`, `TupleToObject`, `QueryParams`, `QueryFormData`, `StrKeyOf`, `GetIndices`, `GetIndex`, `IsParamRequired`, `Assign` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

This package has no runtime utilities. Type assertions are checked by TypeScript through `test:types`; running Vitest alone does not validate type equality or expected compiler errors.

## Tests and development

```sh
pnpm --filter @1adybug/types... build
pnpm --filter @1adybug/types test
pnpm --filter @1adybug/types test:types
```

All exported type utilities: positive and negative equality, union optionality, JSON-compatible shapes, strict keys, readonly errors, query/form round-trips, tuple boundaries and required/optional parameters.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
