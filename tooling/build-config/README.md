# @1adybug/build-config

[English](README.md) | [简体中文](README.zh-CN.md)

Shared internal Rslib configuration and deterministic barrel generation for workspace libraries.

## Features

- Web builds default to ESM/CJS, Node builds to ESM, with declarations generated once and type errors failing the build.
- React plugin detection and sorted export generation that excludes declarations and test files.

## Installation and requirements

```sh
pnpm add -D @1adybug/build-config@workspace:*
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```tsx
import { getRslibConfig } from "@1adybug/build-config"

export default getRslibConfig({ target: "web" })

// Scripts can use getExports(root) and writeCode(file, content)
// from @1adybug/build-config/exports.
```

## Public API

| Entry       | Purpose                     |
| ----------- | --------------------------- |
| `.`         | Shared build configuration  |
| `./exports` | Exported workspace resource |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Private workspace tooling; consume with workspace:* rather than as an npm runtime dependency. getRslibConfig returns an async configuration factory and reads package.json from the build working directory. writeCode preserves mtimes for unchanged content.

## Tests and development

```sh
pnpm --filter @1adybug/build-config test
```

Clean-package build and consumption in ESM/CJS, declaration failure, target/React detection, export filtering and stable output.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

Private workspace tooling; not published to npm.
