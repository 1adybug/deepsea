# soda-tanstack-form

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/tanstack-form`. Small typed bridges between TanStack Form field context and reusable React field components.

## Installation

```sh
pnpm add soda-tanstack-form
```

## Usage and entry points

See the [implementation package](../../packages/tanstack-form/README.md) for usage and behavior. Replace its package name with `soda-tanstack-form`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target                   |
| -------------- | ------------------------ |
| `.`            | `@1adybug/tanstack-form` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-tanstack-form... build
pnpm --filter soda-tanstack-form test
pnpm --filter soda-tanstack-form test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
