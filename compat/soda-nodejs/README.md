# soda-nodejs

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/node`. Node.js helpers for files, response streams, child processes and archives.

## Installation

```sh
pnpm add soda-nodejs
```

## Usage and entry points

See the [implementation package](../../packages/node/README.md) for usage and behavior. Replace its package name with `soda-nodejs`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target          |
| -------------- | --------------- |
| `.`            | `@1adybug/node` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

## Tests and development

```sh
pnpm --filter soda-nodejs... build
pnpm --filter soda-nodejs test
pnpm --filter soda-nodejs test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
