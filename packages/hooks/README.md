# @1adybug/hooks

[English](README.md) | [简体中文](README.zh-CN.md)

React hooks for external storage, typed URL state, DOM effects, element measurement, interaction, media and browser lifecycle.

## Features

- Stable refs and effects, input-derived state, query parsing and storage synchronization.
- Drag, long press, resize, autoplay, video stalls, scroll restoration and ETag refresh detection.

## Installation and requirements

```sh
pnpm add @1adybug/hooks
```

Repository development uses Node.js 24 (>=24.15.0 and <25) and pnpm 11.10.0. The table lists peer ranges declared by this workspace; the host should provide the corresponding shared runtime instances.

| Peer dependency | Workspace range |
| --------------- | --------------- |
| `@types/react`  | `^19.3.0`       |
| `react`         | `^19.3.1`       |

## Quick start

```tsx
import { useLocalStorageState, useNativeQueryState } from "@1adybug/hooks"

function Filters() {
    const [theme, setTheme] = useLocalStorageState("theme")

    const [query, setQuery] = useNativeQueryState({
        parse: { page: value => Number(value ?? 1) },
    })

    return (
        <button
            onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark")
                setQuery({ page: query.page + 1 })
            }}
        >
            Next page
        </button>
    )
}
```

## Public API

| Module                                                                                     | Exports                                                                                                                                        |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| [src/hooks/useArraySignal.ts](src/hooks/useArraySignal.ts)                                 | `useArraySignal`                                                                                                                               |
| [src/hooks/useAsync.ts](src/hooks/useAsync.ts)                                             | `useAsync`                                                                                                                                     |
| [src/hooks/useAutoPlay.ts](src/hooks/useAutoPlay.ts)                                       | `useAutoPlay`                                                                                                                                  |
| [src/hooks/useAutoRefresh.ts](src/hooks/useAutoRefresh.ts)                                 | `AutoRefreshParams`, `useAutoRefresh`                                                                                                          |
| [src/hooks/useBrowser.ts](src/hooks/useBrowser.ts)                                         | `BrowserParser`, `useBrowser`                                                                                                                  |
| [src/hooks/useBrowserGate.ts](src/hooks/useBrowserGate.ts)                                 | `BrowserCheckTree`, `useBrowserGate`                                                                                                           |
| [src/hooks/useBrowserGateSafe.ts](src/hooks/useBrowserGateSafe.ts)                         | `useBrowserGateSafe`                                                                                                                           |
| [src/hooks/useBrowserSafe.ts](src/hooks/useBrowserSafe.ts)                                 | `useBrowserSafe`                                                                                                                               |
| [src/hooks/useCalcEffect.ts](src/hooks/useCalcEffect.ts)                                   | `useCalcEffect`                                                                                                                                |
| [src/hooks/useCalcRef.ts](src/hooks/useCalcRef.ts)                                         | `useCalcRef`                                                                                                                                   |
| [src/hooks/useDomEffect.ts](src/hooks/useDomEffect.ts)                                     | `ElementType`, `ElementInput`, `getElement`, `GetElement`, `GetElements`, `useDomEffect`                                                       |
| [src/hooks/useDragMove.ts](src/hooks/useDragMove.ts)                                       | `DragMoveEvent`, `DragMoveEvents`, `UseDragMoveParams`, `useDragMove`                                                                          |
| [src/hooks/useEventListener.ts](src/hooks/useEventListener.ts)                             | `useEventListener`                                                                                                                             |
| [src/hooks/useInputState.ts](src/hooks/useInputState.ts)                                   | `useInputState`                                                                                                                                |
| [src/hooks/useIsActive.ts](src/hooks/useIsActive.ts)                                       | `LocationState`, `UseLocation`, `createUseIsActive`                                                                                            |
| [src/hooks/useLatest.ts](src/hooks/useLatest.ts)                                           | `useLatest`                                                                                                                                    |
| [src/hooks/useLocalStorageState.ts](src/hooks/useLocalStorageState.ts)                     | `useLocalStorageState`                                                                                                                         |
| [src/hooks/useLongPress.ts](src/hooks/useLongPress.ts)                                     | `UseLongPressOptions`, `useLongPress`                                                                                                          |
| [src/hooks/useNativeQueryState.ts](src/hooks/useNativeQueryState.ts)                       | `QueryToStateFnMap`, `StateToQueryFnMap`, `QueryStateOptions`, `QueryState`, `SetQueryState`, `NativeQueryStateOptions`, `useNativeQueryState` |
| [src/hooks/useScrollMemo.ts](src/hooks/useScrollMemo.ts)                                   | `ScrollMemoOptions`, `useScrollMemo`                                                                                                           |
| [src/hooks/useSearchTree.ts](src/hooks/useSearchTree.ts)                                   | `SearchTreeResult`, `useSearchTree`                                                                                                            |
| [src/hooks/useSessionStorageState.ts](src/hooks/useSessionStorageState.ts)                 | `useSessionStorageState`                                                                                                                       |
| [src/hooks/useSize.ts](src/hooks/useSize.ts)                                               | `Size`, `UseSizeOptions`, `useSize`                                                                                                            |
| [src/hooks/useStableEffect.ts](src/hooks/useStableEffect.ts)                               | `useStableEffect`                                                                                                                              |
| [src/hooks/useStorageState.ts](src/hooks/useStorageState.ts)                               | `UseStorageStateParams`, `useStorageState`, `createUseStorageState`                                                                            |
| [src/hooks/useThirdPartyImageErrorHandler.ts](src/hooks/useThirdPartyImageErrorHandler.ts) | `ThirdPartyImageErrorHandlerTarget`, `ThirdPartyImageErrorHandlerOptions`, `useThirdPartyImageErrorHandler`                                    |
| [src/hooks/useTransitionNum.ts](src/hooks/useTransitionNum.ts)                             | `useTransitionNum`                                                                                                                             |
| [src/hooks/useVideoStalled.ts](src/hooks/useVideoStalled.ts)                               | `UseVideoStalledParams`, `useVideoStalled`                                                                                                     |
| [src/utils/compareArray.ts](src/utils/compareArray.ts)                                     | `compareArray`                                                                                                                                 |
| [src/utils/compareSearch.ts](src/utils/compareSearch.ts)                                   | `compareSearch`                                                                                                                                |
| [src/utils/transformState.ts](src/utils/transformState.ts)                                 | `TransformStateParams`, `transformState`                                                                                                       |

See the linked source and shipped declarations for types, overloads and parameter documentation. package.json exports defines public subpaths.

## Behavior and integration

Browser hooks need DOM APIs; this includes storage bindings created at module evaluation. `Safe` browser hooks defer user-agent parsing until mount. Exact query mode edits the declared keys and retains unrelated URL keys; omitted managed keys are removed by a setter call. Turn off exact mode to replace the query set. Register `@1adybug/hooks/eslint` for `useStableEffect` dependency linting.

## Tests and development

```sh
pnpm --filter @1adybug/hooks... build
pnpm --filter @1adybug/hooks test
pnpm --filter @1adybug/hooks test:types
```

Each hook's state/identity and lifecycle contracts, repeated query values, storage areas, dependency changes, DOM listener replacement, drag/press cancellation, observer cleanup, autoplay retry, ETag changes and media watchdogs.

Run commands from the repository root. See [TESTING.md](../../TESTING.md) for full checks and coverage reports.

## License

MIT.
