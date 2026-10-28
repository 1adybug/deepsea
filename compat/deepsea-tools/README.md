# deepsea-tools

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/tools`. General-purpose TypeScript utilities for parsing, collections, request middleware, browser storage, spreadsheets, geometry and animation.

## Installation

```sh
pnpm add deepsea-tools
```

## Usage and entry points

See the [implementation package](../../packages/tools/README.md) for usage and behavior. Replace its package name with `deepsea-tools`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target           |
| -------------- | ---------------- |
| `.`            | `@1adybug/tools` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter deepsea-tools... build
pnpm --filter deepsea-tools test
pnpm --filter deepsea-tools test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
