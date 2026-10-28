# soda-tailwind

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/tailwind`. A Tailwind CSS 3 plugin for flexible fill sizing, justified text and full background sizing.

## Installation

```sh
pnpm add soda-tailwind
```

## Usage and entry points

See the [implementation package](../../packages/tailwind/README.md) for usage and behavior. Replace its package name with `soda-tailwind`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target              |
| -------------- | ------------------- |
| `.`            | `@1adybug/tailwind` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-tailwind... build
pnpm --filter soda-tailwind test
pnpm --filter soda-tailwind test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
