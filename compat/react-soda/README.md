# react-soda

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/store`. Small React external stores with selectors, subscriptions, immutable object updates and optional persistent storage.

## Installation

```sh
pnpm add react-soda
```

## Usage and entry points

See the [implementation package](../../packages/store/README.md) for usage and behavior. Replace its package name with `react-soda`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target           |
| -------------- | ---------------- |
| `.`            | `@1adybug/store` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter react-soda... build
pnpm --filter react-soda test
pnpm --filter react-soda test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
