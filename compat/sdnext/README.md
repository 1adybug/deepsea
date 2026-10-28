# sdnext

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/next-cli`. Next.js project CLI for generating server actions, action-route registries and client query/mutation hooks from shared modules.

## Installation

```sh
pnpm add sdnext
```

## Usage and entry points

See the [implementation package](../../packages/next-cli/README.md) for usage and behavior. Replace its package name with `sdnext`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target              |
| -------------- | ------------------- |
| `.`            | `@1adybug/next-cli` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

Commands: `sdnext`.

## Tests and development

```sh
pnpm --filter sdnext... build
pnpm --filter sdnext test
pnpm --filter sdnext test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
