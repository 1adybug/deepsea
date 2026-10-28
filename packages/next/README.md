# @1adybug/next

[English](README.md) | [简体中文](README.zh-CN.md)

React helpers for Next.js App Router query state and declarative navigation.

## Features

- Typed query parsing/serialization backed by next/navigation.
- Push/replace navigation with configurable scroll behavior.

## Installation and requirements

```sh
pnpm add @1adybug/next
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `@types/react`  | `^19.3.0`       |
| `next`          | `^16.4.3`       |
| `react`         | `^19.3.1`       |

## Quick start

```tsx
"use client"

import { useQueryState } from "@1adybug/next"

export function Pager() {
    const [query, setQuery] = useQueryState({
        parse: { page: value => Number(value ?? 1) },
        replace: true,
    })

    return <button onClick={() => setQuery({ page: query.page + 1 })}>Next</button>
}
```

## Public API

| Module                                                               | Exports                                             |
| -------------------------------------------------------------------- | --------------------------------------------------- |
| [src/components/Navigate.tsx](src/components/Navigate.tsx)           | `NavigateProps`, `Navigate`                         |
| [src/hooks/useNextSearchParams.ts](src/hooks/useNextSearchParams.ts) | `SetNextSearchParamsOptions`, `useNextSearchParams` |
| [src/hooks/useQueryState.ts](src/hooks/useQueryState.ts)             | `useQueryState`                                     |
| [src/types/index.ts](src/types/index.ts)                             | `PageError`, `ErrorPageProps`, `DynamicPageProps`   |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Use within a Next.js App Router client-component boundary. useQueryState defaults to scroll: false and preserves unrelated parameters in exact mode. The stable search setter uses the latest rendered pathname, search snapshot and navigation options.

## Tests and development

```sh
pnpm --filter @1adybug/next... build
pnpm --filter @1adybug/next test
pnpm --filter @1adybug/next test:types
```

Encoded parameters, functional updates after route changes, setter identity, push/replace options, typed query delegation and Navigate behavior against a mocked Next navigation boundary.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
