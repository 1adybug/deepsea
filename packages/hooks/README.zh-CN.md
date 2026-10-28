# @1adybug/hooks

[English](README.md) | [简体中文](README.zh-CN.md)

React Hook 工具集，涵盖外部存储、类型化 URL 状态、DOM 副作用、元素测量、交互、媒体与浏览器生命周期。

## 能力

- 稳定引用与副作用、由输入派生的状态、查询解析和存储同步。
- 拖拽、长按、尺寸观察、自动播放、视频停滞、滚动恢复与 ETag 更新检测。

## 安装与运行环境

```sh
pnpm add @1adybug/hooks
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖      | 工作区范围 |
| -------------- | ---------- |
| `@types/react` | `^19.3.0`  |
| `react`        | `^19.3.1`  |

## 快速开始

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

## 公开 API

| 模块                                                                                       | 导出                                                                                                                                           |
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

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

浏览器 Hook 依赖 DOM API，包括模块加载时创建的存储绑定。带 `Safe` 的浏览器 Hook 在挂载后解析 UA。精确查询模式仅管理声明的键并保留其他 URL 参数，setter 中省略的受管键会被移除；关闭 exact 后替换整个查询集合。可使用 `@1adybug/hooks/eslint` 配置 `useStableEffect` 依赖检查。

## 测试与开发

```sh
pnpm --filter @1adybug/hooks... build
pnpm --filter @1adybug/hooks test
pnpm --filter @1adybug/hooks test:types
```

各 Hook 的状态、引用与生命周期契约，重复查询值、存储区域、依赖变化、监听器更新、拖拽与长按取消、观察器清理、播放重试、ETag 变化和媒体监测。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
