# soda-antd

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/antd`. Ant Design helpers for typed selections, searchable options, reactive forms, filtered trees, table sizing and worksheet export.

## Installation

```sh
pnpm add soda-antd
```

## Usage and entry points

See the [implementation package](../../packages/antd/README.md) for usage and behavior. Replace its package name with `soda-antd`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target          |
| -------------- | --------------- |
| `.`            | `@1adybug/antd` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-antd... build
pnpm --filter soda-antd test
pnpm --filter soda-antd test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
