# @1adybug/react-router-cli

[English](README.md) | [简体中文](README.zh-CN.md)

Filesystem route generation for React Router, with a CLI and Vite/Rsbuild development integrations.

## Features

- Generate a router from pages, layouts, errors, loaders/actions, dynamic segments, groups and catch-all routes.
- Stable generated output, project aliases, coalesced file watching and development reloads.

## Installation and requirements

```sh
pnpm add @1adybug/react-router-cli
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `@rsbuild/core` | `^2.2.14`       |
| `vite`          | `^8.3.5`        |

## Quick start

```tsx
import { createRouter } from "@1adybug/react-router-cli"

await createRouter({
    root: process.cwd(),
    appDir: "app",
    routerOutputPath: "components/Router.tsx",
    routerExportType: "named",
})

// Vite: import { sdrrVitePlugin } from "@1adybug/react-router-cli/vite"
// Rsbuild: import { sdrrRsbuildPlugin } from "@1adybug/react-router-cli/rsbuild"
```

## Public API

| Module                       | Exports                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `createRouter`, `ResolvedSdrrOptions`, `SdrrOptions`, `resolveSdrrOptions`, `syncRouter`, `WatchSdrrHooks`, `WatchSdrrOptions`, `watchSdrr` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Node-only generator. Generated source imports React and React Router from the host app. Pages use page.tsx and layouts use layout.tsx; [id], [...path], [[...path]] and (group) directories describe segments. Parallel/intercepting route conventions are not a Next.js runtime. The sdrr executable exposes build, dev and hook commands; build/dev can wrap a command following --. Editor settings are updated only when explicitly enabled in API options.

## Tests and development

Generated Hook sources are compiled against the real library declarations in tests. CLI process tests also cover exit-code propagation, startup failures and peer-process cleanup.

```sh
pnpm --filter @1adybug/react-router-cli... build
pnpm --filter @1adybug/react-router-cli test
pnpm --filter @1adybug/react-router-cli test:types
```

Temporary-project route generation, custom paths, aliases, errors, lazy/data routes, precedence, stable mtimes, watcher coalescing/recovery, Vite reload/disposal and Rsbuild lifecycle hooks.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
