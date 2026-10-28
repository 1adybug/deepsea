# @1adybug/react-router

[English](README.md) | [简体中文](README.zh-CN.md)

面向 React Router 应用的类型化 URL 查询状态 Hook。

## 能力

- 支持类型解析器、序列化器和受管键的 useQueryState。
- 通过 createUseQueryState 注入路由 Hook，并选择替换和滚动行为。

## 安装与运行环境

```sh
pnpm add @1adybug/react-router
```

仓库开发使用 Node.js 24（>=24.15.0 且 <25）和 pnpm 11.10.0。下表给出本工作区声明的 peer 兼容范围，宿主应用应使用同一份对应运行时。

| Peer 依赖      | 工作区范围 |
| -------------- | ---------- |
| `react`        | `^19.3.1`  |
| `@types/react` | `^19.3.0`  |
| `react-router` | `^7.18.5`  |

## 快速开始

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

## 公开 API

| 模块                                                     | 导出                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------- |
| [src/hooks/useQueryState.ts](src/hooks/useQueryState.ts) | `SetQueryStateOptions`, `createUseQueryState`, `useQueryState` |

导出类型、重载与参数说明见上述源码及随包声明；公开子路径以 package.json 的 exports 为准。

## 行为与集成约束

在 React Router Provider 中渲染。createUseQueryState 可绑定宿主的 useSearchParams，避免重复路由实例。scroll: false 对应 preventScrollReset: true。查询键和替换语义与 @1adybug/hooks 共享。

## 测试与开发

```sh
pnpm --filter @1adybug/react-router... build
pnpm --filter @1adybug/react-router test
pnpm --filter @1adybug/react-router test:types
```

真实 MemoryRouter 更新、其他参数保留、重复值解析、删除、替换和注入适配器选项。

从仓库根目录运行命令。完整检查与覆盖率说明见 [TESTING.zh-CN.md](../../TESTING.zh-CN.md)。

## 许可证

MIT.
