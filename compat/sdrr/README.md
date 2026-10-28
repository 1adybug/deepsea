# sdrr

[English](README.md) | [简体中文](README.zh-CN.md)

Compatibility package name for `@1adybug/react-router-cli`. Filesystem route generation for React Router, with a CLI and Vite/Rsbuild development integrations.

## Installation

```sh
pnpm add sdrr
```

## Usage and entry points

See the [implementation package](../../packages/react-router-cli/README.md) for usage and behavior. Replace its package name with `sdrr`; exported subpaths forward to the same implementation subpaths.

| Public subpath | Target                              |
| -------------- | ----------------------------------- |
| `.`            | `@1adybug/react-router-cli`         |
| `./vite`       | `@1adybug/react-router-cli/vite`    |
| `./rsbuild`    | `@1adybug/react-router-cli/rsbuild` |

## Runtime and contracts

This package forwards exports and maintains no separate application state. ESM uses re-exports; CommonJS entries forward the target module object. Default exports, type entries and executables follow each entry's declaration. Dependency and peer requirements follow the implementation package.

Commands: `sdrr`.

## Tests and development

```sh
pnpm --filter sdrr... build
pnpm --filter sdrr test
pnpm --filter sdrr test:types
```

Tests verify forwarding code, declarations, dependency/peer contracts, ESM reference identity, CommonJS module identity and CLI help/version where applicable. Representative subpaths and workspace artifact checks cover wildcard entry families.

## License

MIT.
