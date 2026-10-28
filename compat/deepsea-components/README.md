# deepsea-components

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/components`. Reusable React components for measured layouts, scrolling, file workflows, charts, media and visual primitives.

## Installation

```sh
pnpm add deepsea-components
```

## Usage and entry points

See the [implementation package](../../packages/components/README.md) for usage and behavior. Replace its package name with `deepsea-components`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target                |
| -------------- | --------------------- |
| `.`            | `@1adybug/components` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter deepsea-components... build
pnpm --filter deepsea-components test
pnpm --filter deepsea-components test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
