# @1adybug/store

[English](README.md) | [简体中文](README.zh-CN.md)

Small React external stores with selectors, subscriptions, immutable object updates and optional persistent storage.

## Features

- Create stores outside components and access state through hooks or imperative methods.
- Sync/async storage hydration, custom codecs and server snapshots.

## Installation and requirements

```sh
pnpm add @1adybug/store
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `@types/react`  | `^19.3.0`       |
| `react`         | `^19.3.1`       |

## Quick start

```tsx
import { createStore } from "@1adybug/store"

const useCounter = createStore({ count: 0 })

function Counter() {
    const [count, setState] = useCounter(state => state.count)
    return <button onClick={() => setState(state => ({ count: state.count + 1 }))}>{count}</button>
}
```

## Public API

| Module                       | Exports                                                                                                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/index.ts](src/index.ts) | `AnyFunction`, `Listener`, `IsPlainObject`, `NewState`, `PlainObjectSetState`, `NonPlainObjectSetState`, `SetState`, `UseStore`, `isPlainObject`, `createStore`, `StateStorage`, `CreatePersistentStoreOption`, `UsePersistentStore`, `createPersistentStore` |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Plain objects merge by default; pass `replace: true` as the second setter argument to replace them. Arrays and other values are replaced. Selectors must return stable snapshots for unchanged data. Persistent stores use the key `react-soda-${name}`. Async hydration must not overwrite a newer local update. Supply a server snapshot for server-rendered consumers.

## Tests and development

```sh
pnpm --filter @1adybug/store... build
pnpm --filter @1adybug/store test
pnpm --filter @1adybug/store test:types
```

Lazy initialization, merge/replace, Object.is no-ops, selectors, subscriptions, server rendering, codec access, corrupt data, async hydration races and storage failures.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
