# @1adybug/react-router

[English](README.md) | [简体中文](README.zh-CN.md)

Typed URL query-state hooks for React Router applications.

## Features

- useQueryState with typed parsers, serializers and managed keys.
- Inject a router hook through createUseQueryState and choose replace/scroll behavior.

## Installation and requirements

```sh
pnpm add @1adybug/react-router
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `react`         | `^19.3.1`       |
| `@types/react`  | `^19.3.0`       |
| `react-router`  | `^7.18.5`       |

## Quick start

```tsx
import { useQueryState } from "@1adybug/react-router"

function Pager() {
    const [query, setQuery] = useQueryState({
        parse: { page: value => Number(value ?? 1) },
        replace: true,
    })

    return <button onClick={() => setQuery({ page: query.page + 1 })}>Next</button>
}
```

## Public API

| Module                                                   | Exports                                                        |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| [src/hooks/useQueryState.ts](src/hooks/useQueryState.ts) | `SetQueryStateOptions`, `createUseQueryState`, `useQueryState` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Render within a React Router provider. createUseQueryState can bind the host router's useSearchParams to avoid duplicate router instances. scroll: false maps to preventScrollReset: true. Query key and replacement semantics are shared with @1adybug/hooks.

## Tests and development

```sh
pnpm --filter @1adybug/react-router... build
pnpm --filter @1adybug/react-router test
pnpm --filter @1adybug/react-router test:types
```

Real MemoryRouter updates, preserved unrelated parameters, repeated-value parsing, deletion, replacement and injected adapter options.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
