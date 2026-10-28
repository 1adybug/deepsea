# soda-tanstack-query

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/tanstack-query`. Typed factories for reusable TanStack Query query and mutation hooks.

## Installation

```sh
pnpm add soda-tanstack-query
```

## Usage and entry points

See the [implementation package](../../packages/tanstack-query/README.md) for usage and behavior. Replace its package name with `soda-tanstack-query`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target                    |
| -------------- | ------------------------- |
| `.`            | `@1adybug/tanstack-query` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-tanstack-query... build
pnpm --filter soda-tanstack-query test
pnpm --filter soda-tanstack-query test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
