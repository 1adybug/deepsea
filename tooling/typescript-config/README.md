# @1adybug/typescript-config

[English](README.md) | [简体中文](README.zh-CN.md)

Internal TypeScript presets for strict shared settings, libraries, React libraries and browser applications.

## Features

- base.json, library.json, react-library.json and app.json with strict bundler-oriented resolution.

## Installation and requirements

```sh
pnpm add -D @1adybug/typescript-config@workspace:*
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```json
{
    "extends": "@1adybug/typescript-config/react-library.json",
    "compilerOptions": { "rootDir": "src" },
    "include": ["src"]
}
```

## Public API

| Entry                  | Purpose                     |
| ---------------------- | --------------------------- |
| `./base.json`          | Exported workspace resource |
| `./library.json`       | Exported workspace resource |
| `./react-library.json` | Exported workspace resource |
| `./app.json`           | Exported workspace resource |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Private workspace tooling. Consumer projects must supply their own include, rootDir and environment type declarations. app.json enables noEmit; library presets enable declarations. Use local overrides where project needs differ.

## Tests and development

```sh
pnpm --filter @1adybug/typescript-config test
```

Compiler-resolved inheritance for all presets, consumer overrides and a real strict-nullability diagnostic.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

Private workspace tooling; not published to npm.
