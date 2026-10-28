# soda-heroui

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/heroui`. HeroUI form adapters and selection utilities for TanStack Form, with date/time conversion, validation messages and toast helpers.

## Installation

```sh
pnpm add soda-heroui
```

## Usage and entry points

See the [implementation package](../../packages/heroui/README.md) for usage and behavior. Replace its package name with `soda-heroui`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target            |
| -------------- | ----------------- |
| `.`            | `@1adybug/heroui` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-heroui... build
pnpm --filter soda-heroui test
pnpm --filter soda-heroui test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
