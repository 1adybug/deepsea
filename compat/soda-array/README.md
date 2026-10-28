# soda-array

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/array`. Typed standalone array functions, modern Array polyfills, and opt-in prototype extensions for JavaScript and TypeScript.

## Installation

```sh
pnpm add soda-array
```

## Usage and entry points

See the [implementation package](../../packages/array/README.md) for usage and behavior. Replace its package name with `soda-array`; exported subpaths forward to the same implementation subpaths.

| Public subpath                  | Target                                       |
| ------------------------------- | -------------------------------------------- |
| `.`                             | `@1adybug/array`                             |
| `./types`                       | `@1adybug/array/types`                       |
| `./auto`                        | `@1adybug/array/auto`                        |
| `./pure`                        | `@1adybug/array/pure`                        |
| `./virtual`                     | `@1adybug/array/virtual`                     |
| `./es`                          | `@1adybug/array/es`                          |
| `./es/array`                    | `@1adybug/array/es/array`                    |
| `./pure/es`                     | `@1adybug/array/pure/es`                     |
| `./pure/es/array`               | `@1adybug/array/pure/es/array`               |
| `./pure/es/virtual`             | `@1adybug/array/pure/es/virtual`             |
| `./pure/es/array/virtual`       | `@1adybug/array/pure/es/array/virtual`       |
| `./es/virtual`                  | `@1adybug/array/es/virtual`                  |
| `./es/array/virtual`            | `@1adybug/array/es/array/virtual`            |
| `./stable`                      | `@1adybug/array/stable`                      |
| `./stable/array`                | `@1adybug/array/stable/array`                |
| `./pure/stable`                 | `@1adybug/array/pure/stable`                 |
| `./pure/stable/array`           | `@1adybug/array/pure/stable/array`           |
| `./pure/stable/virtual`         | `@1adybug/array/pure/stable/virtual`         |
| `./pure/stable/array/virtual`   | `@1adybug/array/pure/stable/array/virtual`   |
| `./stable/virtual`              | `@1adybug/array/stable/virtual`              |
| `./stable/array/virtual`        | `@1adybug/array/stable/array/virtual`        |
| `./actual`                      | `@1adybug/array/actual`                      |
| `./actual/array`                | `@1adybug/array/actual/array`                |
| `./pure/actual`                 | `@1adybug/array/pure/actual`                 |
| `./pure/actual/array`           | `@1adybug/array/pure/actual/array`           |
| `./pure/actual/virtual`         | `@1adybug/array/pure/actual/virtual`         |
| `./pure/actual/array/virtual`   | `@1adybug/array/pure/actual/array/virtual`   |
| `./actual/virtual`              | `@1adybug/array/actual/virtual`              |
| `./actual/array/virtual`        | `@1adybug/array/actual/array/virtual`        |
| `./full`                        | `@1adybug/array/full`                        |
| `./full/array`                  | `@1adybug/array/full/array`                  |
| `./pure/full`                   | `@1adybug/array/pure/full`                   |
| `./pure/full/array`             | `@1adybug/array/pure/full/array`             |
| `./pure/full/virtual`           | `@1adybug/array/pure/full/virtual`           |
| `./pure/full/array/virtual`     | `@1adybug/array/pure/full/array/virtual`     |
| `./full/virtual`                | `@1adybug/array/full/virtual`                |
| `./full/array/virtual`          | `@1adybug/array/full/array/virtual`          |
| `./features`                    | `@1adybug/array/features`                    |
| `./features/array`              | `@1adybug/array/features/array`              |
| `./pure/features`               | `@1adybug/array/pure/features`               |
| `./pure/features/array`         | `@1adybug/array/pure/features/array`         |
| `./pure/features/virtual`       | `@1adybug/array/pure/features/virtual`       |
| `./pure/features/array/virtual` | `@1adybug/array/pure/features/array/virtual` |
| `./features/virtual`            | `@1adybug/array/features/virtual`            |
| `./features/array/virtual`      | `@1adybug/array/features/array/virtual`      |

Wildcard subpaths mirror the implementation's entry families, including pure, virtual, auto and corresponding .js forms.

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-array... build
pnpm --filter soda-array test
pnpm --filter soda-array test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
