# @1adybug/array

[English](README.md) | [简体中文](README.zh-CN.md)

Typed standalone array functions, modern Array polyfills, and opt-in prototype extensions for JavaScript and TypeScript.

## Features

- Standard methods and async iteration through core-js; custom chunking, immutable updates, deduplication and set operations.
- Pure, virtual and global entry families with ESM, CommonJS and TypeScript declarations.

## Installation and requirements

```sh
pnpm add @1adybug/array
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```tsx
import array, { chunk, nonNullable } from "@1adybug/array"

chunk([1, 2, 3], 2) // [[1, 2], [3]]

nonNullable([0, false, null, undefined]) // [0, false]

array.toPushed([1, 2], 3) // [1, 2, 3]
```

## Public API

| Entry                    | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `Root / pure`            | Standalone methods and default array function object |
| `auto / global families` | Opt-in global installation                           |
| `virtual families`       | Methods called with an explicit receiver             |
| `types`                  | Ambient Array declarations                           |

See [api.d.ts](api.d.ts) for all methods and overloads. Entry families include es, stable, actual, full and features, with array/pure/virtual combinations; package.json exports is the authoritative entry map.

## Behavior and integration

The default import is pure. Import `@1adybug/array/auto` or call `extendArrayPrototype()` only when global extensions are intentional. Use the `types` entry for ambient declarations. Some entry families include proposal APIs; choose the family explicitly. `asNonNullable` is a type assertion and does not filter values. `union` preserves duplicates already present in each input.

## Tests and development

```sh
pnpm --filter @1adybug/array... build
pnpm --filter @1adybug/array test
pnpm --filter @1adybug/array test:types
```

Every ArrayFunctions method, sparse arrays, array-like receivers, species, coercion, invalid inputs, prototype installation, pure/global isolation, generated entry resolution and bundling.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
