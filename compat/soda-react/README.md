# soda-react

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/react`. React node validation and text/worksheet-cell conversion helpers.

## Installation

```sh
pnpm add soda-react
```

## Usage and entry points

See the [implementation package](../../packages/react/README.md) for usage and behavior. Replace its package name with `soda-react`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target           |
| -------------- | ---------------- |
| `.`            | `@1adybug/react` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-react... build
pnpm --filter soda-react test
pnpm --filter soda-react test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
