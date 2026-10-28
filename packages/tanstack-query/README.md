# @1adybug/tanstack-query

[English](README.md) | [简体中文](README.zh-CN.md)

Typed factories for reusable TanStack Query query and mutation hooks.

## Features

- Parameterized query keys, initial data, per-call options and refinable query hooks.
- Shared mutation defaults, ordered lifecycle callbacks and explicit QueryClient selection.

## Installation and requirements

```sh
pnpm add @1adybug/tanstack-query
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency         | Workspace range |
| ----------------------- | --------------- |
| `@tanstack/react-query` | `^5.105.0`      |
| `@types/react`          | `^19.3.0`       |
| `react`                 | `^19.3.1`       |

## Quick start

```tsx
import { createUseQuery } from "@1adybug/tanstack-query"

const useItem = createUseQuery({
    queryKey: "item",
    queryFn: async (id: number) => ({ id, name: `Item ${id}` }),
})

const useItemName = useItem.refine({ select: item => item.name })

function ItemName() {
    const query = useItemName(1)
    return <span>{query.data}</span>
}
```

## Public API

| Module                                                           | Exports                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/utils/createUseMutation.ts](src/utils/createUseMutation.ts) | `CreateUseMutationOptions`, `UseConfiguredMutation`, `createUseMutation`, `withUseMutationDefaults`                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [src/utils/createUseQuery.ts](src/utils/createUseQuery.ts)       | `UseQueryWithParams`, `UseQueryWithOptionalParams`, `UseQuery`, `CreateUseQueryDefinedInitialDataParams`, `UseQueryDefinedInitialDataWithParams`, `UseQueryDefinedInitialDataWithOptionalParams`, `_UseQueryDefinedInitialData`, `UseQueryDefinedInitialData`, `CreateUseQueryUndefinedInitialDataParams`, `UseQueryUndefinedInitialDataWithParams`, `UseQueryUndefinedInitialDataWithOptionalParams`, `UseQueryUndefinedInitialData`, `CreateUseQueryParams`, `setUseQuery`, `createUseQuery`, `GetHookFromParams` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Render under the host QueryClientProvider or supply a QueryClient to the factory/call. Queries use [queryKey, params] as their cache key. Mutation base callbacks run before override callbacks; the override onMutate result is forwarded as mutation context. Query and mutation functions must follow TanStack Query error semantics.

## Tests and development

```sh
pnpm --filter @1adybug/tanstack-query... build
pnpm --filter @1adybug/tanstack-query test
pnpm --filter @1adybug/tanstack-query test:types
```

Real QueryClient caching, parameter changes, selections, initial/disabled states, error identity, client overrides, refinements, injected query hooks and mutation success/error/settled ordering.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
