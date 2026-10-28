# @1adybug/next-cli

[English](README.md) | [简体中文](README.zh-CN.md)

Next.js project CLI for generating server actions, action-route registries and client query/mutation hooks from shared modules.

## Features

- Build and watch shared modules while optionally wrapping a host development/build command.
- Deterministic action/route output, project import aliases and configurable hook generation.

## Installation and requirements

```sh
pnpm add @1adybug/next-cli
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

This package declares no peer dependencies.

## Quick start

```sh
# Run inside a Next.js project with shared/ and server/createResponseFn
pnpm exec sdnext --help
pnpm exec sdnext build
pnpm exec sdnext dev -- next dev
pnpm exec sdnext hook
```

## Public API

| Entry          | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `sdnext build` | Generate artifacts, then optionally run a command           |
| `sdnext dev`   | Generate and watch artifacts with an optional child command |
| `sdnext hook`  | Interactive query/mutation hook generation                  |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

This is an executable package: importing its root runs the CLI parser. Run sdnext in the target project. Shared modules must export a function named after the file; generated files expect the host's server/createResponseFn helpers. Output uses actions/ and app/api/action/[...action]/route.ts. hook is interactive and can persist choices in ~/.sdnext.json. Review generated source as part of the host application.

## Tests and development

Generated Hook sources are compiled against the real library declarations in tests. CLI process tests also cover exit-code propagation, startup failures and peer-process cleanup.

```sh
pnpm --filter @1adybug/next-cli... build
pnpm --filter @1adybug/next-cli test
pnpm --filter @1adybug/next-cli test:types
```

Clean temporary-project action/route generation, deterministic registry ordering, relative/alias imports, ignored assets, stale artifact removal, directory pruning, no-op mtimes and CLI help/version.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
