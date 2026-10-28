# Deepsea

[English](README.md) | [简体中文](README.zh-CN.md)

Deepsea is a modular JavaScript and TypeScript library workspace for data processing, React state and interaction, UI integrations, route generation and Node.js utilities. Libraries install independently and share explicit package boundaries, typed APIs and build tooling.

## Contents

- [Packages](#packages)
- [Install and use](#install-and-use)
- [Workspace development](#workspace-development)
- [Testing and quality](#testing-and-quality)
- [Package formats and compatibility entries](#package-formats-and-compatibility-entries)
- [Contributing and releases](#contributing-and-releases)
- [License](#license)

## Packages

| Package                                                            | Purpose                                                                                                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`@1adybug/array`](packages/array/README.md)                       | Typed standalone array functions, modern Array polyfills, and opt-in prototype extensions for JavaScript and TypeScript.                   |
| [`@1adybug/tools`](packages/tools/README.md)                       | General-purpose TypeScript utilities for parsing, collections, request middleware, browser storage, spreadsheets, geometry and animation.  |
| [`@1adybug/types`](packages/types/README.md)                       | Compile-time TypeScript utilities for union analysis, strict object transformations, tuple indexing, function parameters and query models. |
| [`@1adybug/store`](packages/store/README.md)                       | Small React external stores with selectors, subscriptions, immutable object updates and optional persistent storage.                       |
| [`@1adybug/hooks`](packages/hooks/README.md)                       | React hooks for external storage, typed URL state, DOM effects, element measurement, interaction, media and browser lifecycle.             |
| [`@1adybug/react`](packages/react/README.md)                       | React node validation and text/worksheet-cell conversion helpers.                                                                          |
| [`@1adybug/components`](packages/components/README.md)             | Reusable React components for measured layouts, scrolling, file workflows, charts, media and visual primitives.                            |
| [`@1adybug/coordinate`](packages/coordinate/README.md)             | Longitude/latitude representations, WGS84/GCJ02/BD09 conversions and geometry helpers.                                                     |
| [`@1adybug/node`](packages/node/README.md)                         | Node.js helpers for files, response streams, child processes and archives.                                                                 |
| [`@1adybug/antd`](packages/antd/README.md)                         | Ant Design helpers for typed selections, searchable options, reactive forms, filtered trees, table sizing and worksheet export.            |
| [`@1adybug/heroui`](packages/heroui/README.md)                     | HeroUI form adapters and selection utilities for TanStack Form, with date/time conversion, validation messages and toast helpers.          |
| [`@1adybug/tanstack-form`](packages/tanstack-form/README.md)       | Small typed bridges between TanStack Form field context and reusable React field components.                                               |
| [`@1adybug/tanstack-query`](packages/tanstack-query/README.md)     | Typed factories for reusable TanStack Query query and mutation hooks.                                                                      |
| [`@1adybug/next`](packages/next/README.md)                         | React helpers for Next.js App Router query state and declarative navigation.                                                               |
| [`@1adybug/react-router`](packages/react-router/README.md)         | Typed URL query-state hooks for React Router applications.                                                                                 |
| [`@1adybug/react-router-cli`](packages/react-router-cli/README.md) | Filesystem route generation for React Router, with a CLI and Vite/Rsbuild development integrations.                                        |
| [`@1adybug/next-cli`](packages/next-cli/README.md)                 | Next.js project CLI for generating server actions, action-route registries and client query/mutation hooks from shared modules.            |
| [`@1adybug/tailwind`](packages/tailwind/README.md)                 | A Tailwind CSS 3 plugin for flexible fill sizing, justified text and full background sizing.                                               |
| [`@1adybug/xlsx`](packages/xlsx/README.md)                         | Spreadsheet parsing and writing through a packaged SheetJS-based runtime, including workbook utilities and Node/browser entry points.      |

## Install and use

Install only the packages you need and provide the peer dependencies listed in their guides. The repository root is a private workspace, not a combined runtime entry.

```sh
pnpm add @1adybug/array @1adybug/tools
```

```ts
import { chunk } from "@1adybug/array"
import { createRequestFn, intParser } from "@1adybug/tools"

const groups = chunk([1, 2, 3, 4, 5], 2)
const page = intParser("2") ?? 1

const load = createRequestFn(async (id: number) => ({
    success: true,
    data: { id },
}))

const item = await load(1)
```

The array root uses pure functions; opt into auto only when global Array extension is intended. React packages share the host's React, UI and router instances. Storage, DOM, animation and media helpers require browser facilities; Node and CLI packages run in Node.

## Workspace development

Development requirements: Node.js >=24.15.0 and <25, and pnpm 11.10.0. See package.json and .node-version for the pinned setup.

```sh
git clone https://github.com/1adybug/deepsea.git
cd deepsea
pnpm install --frozen-lockfile
pnpm build:packages
pnpm dev
```

```text
deepsea/
  packages/   # independently installable libraries and CLIs
  compat/     # forwarding package-name entries
  tooling/    # private build and TypeScript presets
  apps/       # interactive playground
  tests/      # shared browser, compatibility and spreadsheet tests
  scripts/    # workspace validation, artifacts and release support
```

| Command               | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`            | Watch the playground and its workspace dependencies                        |
| `pnpm build`          | Build all packages and the playground in dependency order                  |
| `pnpm build:packages` | Build publishable libraries and compatibility entries                      |
| `pnpm test`           | Run all 40 workspace package test tasks with build prerequisites           |
| `pnpm test:types`     | Compile runtime-test and type-contract fixtures                            |
| `pnpm test:coverage`  | Produce V8 reports for first-party TypeScript libraries and the playground |
| `pnpm check`          | Validate boundaries, formatting, lint, types, tests, builds and artifacts  |
| `pnpm clean`          | Remove generated workspace outputs                                         |

## Testing and quality

Tests follow public API responsibilities: functions cover inputs, outputs, boundaries and failures; components cover rendering, interaction, updates and cleanup; type utilities use compiler-checked inference and negative cases; CLIs exercise generation, watching and cleanup in temporary projects; compatibility packages verify real entries, declarations and shared references. Aliases sharing an implementation reuse behavior tests and verify entry identity.

See the [testing guide](TESTING.md). Coverage reports help locate omissions; they do not establish visual acceptance, real media/network behavior, device interaction or every upstream library behavior. CI runs the full checks on Windows and Linux.

## Package formats and compatibility entries

Most runtime libraries ship ESM, CommonJS and TypeScript declarations. Node generators and CLIs primarily use ESM; XLSX also exposes dedicated browser and encoding entries. Import through the exports declared by each package.json.

| Compatibility name                                            | Implementation              |
| ------------------------------------------------------------- | --------------------------- |
| [`deepsea-components`](compat/deepsea-components/README.md)   | `@1adybug/components`       |
| [`deepsea-tools`](compat/deepsea-tools/README.md)             | `@1adybug/tools`            |
| [`react-soda`](compat/react-soda/README.md)                   | `@1adybug/store`            |
| [`sdnext`](compat/sdnext/README.md)                           | `@1adybug/next-cli`         |
| [`sdrr`](compat/sdrr/README.md)                               | `@1adybug/react-router-cli` |
| [`soda-antd`](compat/soda-antd/README.md)                     | `@1adybug/antd`             |
| [`soda-array`](compat/soda-array/README.md)                   | `@1adybug/array`            |
| [`soda-coordinate`](compat/soda-coordinate/README.md)         | `@1adybug/coordinate`       |
| [`soda-heroui`](compat/soda-heroui/README.md)                 | `@1adybug/heroui`           |
| [`soda-hooks`](compat/soda-hooks/README.md)                   | `@1adybug/hooks`            |
| [`soda-next`](compat/soda-next/README.md)                     | `@1adybug/next`             |
| [`soda-nodejs`](compat/soda-nodejs/README.md)                 | `@1adybug/node`             |
| [`soda-react`](compat/soda-react/README.md)                   | `@1adybug/react`            |
| [`soda-react-router`](compat/soda-react-router/README.md)     | `@1adybug/react-router`     |
| [`soda-tailwind`](compat/soda-tailwind/README.md)             | `@1adybug/tailwind`         |
| [`soda-tanstack-form`](compat/soda-tanstack-form/README.md)   | `@1adybug/tanstack-form`    |
| [`soda-tanstack-query`](compat/soda-tanstack-query/README.md) | `@1adybug/tanstack-query`   |
| [`soda-type`](compat/soda-type/README.md)                     | `@1adybug/types`            |

Internal presets: [build-config](tooling/build-config/README.md), [typescript-config](tooling/typescript-config/README.md). Interactive examples: [playground](apps/playground/README.md).

## Contributing and releases

Fix behavior at its original state or execution boundary and add a discriminating regression test. Run pnpm check before submitting and update both documentation languages for public behavior changes. External versions live in the root catalog; internal edges use workspace:*. Record public changes with pnpm changeset and update versions with pnpm version:packages. Run pnpm release for full checks followed by Changesets publication. Publication reuses the verified build outputs and skips package lifecycle scripts so concurrent rebuilds cannot delete declarations another package is reading.

## License

Library and compatibility package manifests declare MIT. @1adybug/xlsx uses Apache-2.0; see its [LICENSE](packages/xlsx/LICENSE). The private root manifest declares ISC. Follow the licenses of the distributed packages and their third-party dependencies.
